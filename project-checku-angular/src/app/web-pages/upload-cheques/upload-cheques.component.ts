import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common'
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfirmDialogService } from '@confirmDialogSerivce';
import { ApiCallService } from '@apiService';

@Component({
  selector: 'app-upload-cheques',
  templateUrl: './upload-cheques.component.html',
  styleUrls: ['./upload-cheques.component.scss'],
  providers: [DatePipe]
})

export class UploadChequesComponent implements OnInit {

  constructor(
    private dp: DatePipe,
    private confirmDialogService: ConfirmDialogService,
    private api: ApiCallService
  ) { }

  isUploaded: boolean = false;
  uploadList: any[] = [];
  folderList: any[] = [];
  chequeList: any[] = [];

  //checkbox
  selectedRows: any[] = [];
  selectAll: boolean = false;
  selectedFolder: any;

  ngOnInit() {
  }

  confirmProcess() {
    let data = {
      header: "Confirmation",
      description: "Process the uploaded cheques?",
      positive: "Yes",
      negative: "Cancel"
    }
    this.confirmDialogService.openDialog(data).then(result => {
      if (result) {
        this.processCheques();
      }
    });
  }

  //when user click on row, shows selected folder image
  viewFolder(folder) {
    this.selectedFolder = folder;
  }

  //when user clicks delete button
  deleteRows() {
    let data = {
      header: "Confirmation",
      description: "Delete the selected rows?",
      positive: "Delete",
      negative: "Cancel"
    }
    this.confirmDialogService.openDialog(data).then(result => {
      if (result) {
        this.selectedRows.forEach((folder) => {
          let index = this.chequeList.indexOf(folder);
          this.chequeList.splice(index, 1);
          let folderIndex = this.folderList.indexOf(folder.folderName);
          this.folderList.splice(folderIndex, 1);
        });
        this.selectedRows = [];
        this.selectedFolder = null;
        if (this.selectAll)
          this.selectAll = !this.selectAll;
      }
    });
  }

  //when user clicks checkbox in list
  onRowSelect(event, folder) {
    if (event.checked == false) {
      this.selectedRows.forEach((element, index) => {
        if (element == folder) {
          this.selectedRows.splice(index, 1);
        }
      });
    } else {
      this.selectedRows.push(folder);
    }

    console.log(this.selectedRows);
  }

  //highlight row when selected
  checkSelected(folder) {
    let exists = '';
    if (this.selectedFolder == folder) {
      exists = 'indigo lighten-5';
    }
    if (this.selectAll) {
      this.selectedRows.forEach(element => {
        if (element == folder) {
          exists = 'blue lighten-5';
        }
      });
    } else {
      this.selectedRows.forEach(element => {
        if (element == folder) {
          exists = 'blue lighten-5';
        }
      });
    }
    return exists;
  }

  //when select all button is clicked
  selectAllRows() {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.chequeList.forEach(folder => {
        this.selectedRows.push(folder);
      });
    } else {
      this.selectedRows = [];
    }

    console.log(this.selectedRows);
  }

  //when user selected a folder to upload
  filesPicked(files) {

    this.uploadList = [];
    this.isUploaded = false;
    for (let i = 0; i < files.length; i++) {
      let foldername: string = files[i].webkitRelativePath.split("/")[1];
      if (this.folderList.indexOf(foldername) == -1) {
        this.folderList.push(foldername);
        this.isUploaded = true;
      }
      if (!this.isUploaded) {
        //reject upload if foldername is the same
        console.log("folder with same name already exists.");
        //TODO: add notifier
        break;
      }

      var reader = new FileReader();

      let name = files[i].name;
      let size = Math.round(files[i].size / 1024); //in kb
      let type = files[i].type;
      let date = this.dp.transform(files[i].lastModifiedDate, "dd/MM/yyyy hh:mm:ss"); //in string

      if (size > 10000) {
        //reject upload if foldername is the same
        console.log("file size is more than 10mb");
        //TODO: add notifier
        break;
      }

      reader.onload = (event: any) => {
        //when file is read, add file details into upload list
        this.uploadList.push(
          {
            name: name,
            size: size,
            type: type,
            date: date,
            folderName: foldername,
            url: event.target.result
          });

        //if last iteration is reached, populate upload list into cheque list
        if (i == files.length - 1) {
          this.loadChequeList(this.uploadList);
        }
      }
      reader.readAsDataURL(files[i]);
    }//end loop
  }


  //prepares a list of cheques which are grouped according to their folders
  loadChequeList(uploadList) {
    for (let i = 0; i < uploadList.length; i += 2) {
      this.chequeList.push({
        folderName: uploadList[i].folderName,
        front: uploadList[i],
        back: uploadList[i + 1]
      });
    }
    console.log(this.chequeList);
  }

  //prepares data to send to backend for OCR processing
  processCheques() {
    let data = {
      data: this.chequeList
    }
    this.api.processScannedCheques(data).then(response => {
      console.log(response);
      //reset
      this.reset();
    },
      error => {
        //TODO: add notifier
        console.log(error);
      }
    ).catch(error => {
      //TODO: add notifier
      console.log(error);
    });
  }

  //clear all vairables
  reset() {
    this.chequeList = [];
    this.uploadList = [];
    this.selectedFolder = null;
    this.isUploaded = false;
    this.selectedRows = [];
    this.folderList = [];
  }
}
