import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-upload-cheques',
  templateUrl: './upload-cheques.component.html',
  styleUrls: ['./upload-cheques.component.scss'],
  providers: [DatePipe]
})

export class UploadChequesComponent implements OnInit {

  constructor(private dp: DatePipe) { }

  ngOnInit() {
  }

  urls = [];
  uploadList: any[] = []; //used when uploading
  //chequeProcessList: any[] = []; //used to show list of cheques for upload preview
  isUploaded: boolean = true;

  onSelectFile(upload) {
    if (upload.target.files && upload.target.files[0]) {
      var filesAmount = upload.target.files.length;

      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        let name = upload.target.files[i].name;
        let size = Math.round(upload.target.files[i].size / 1024); //in kb
        let type = upload.target.files[i].type;
        let date = this.dp.transform(upload.target.files[i].lastModifiedDate, "dd/MM/yyyy hh:mm:ss"); //in string

        if (size > 10000) {
          this.isUploaded = false;
          break;
          //TODO: create alert message to say file size exceed 10MB limit
        } else {

          reader.onload = (event: any) => {
            this.urls.push(event.target.result);
            this.uploadList.push(
              {
                name: name,
                size: size,
                type: type,
                date: date,
                url: event.target.result
              });
          }
          reader.readAsDataURL(upload.target.files[i]);
        }
      }
      console.log(this.uploadList);
    }
  }
}
