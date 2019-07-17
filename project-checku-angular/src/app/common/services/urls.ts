export const URLS = {
    //determine to use replace data or data from server
    stubData: true,

    //get url methods
    //main page api calls
    GET_PENDING_REC: "getPendingRec",
    GET_HOLDING_REC: "getHoldingRec",
    GET_SUCCESS_REC: "getSuccessRec",
    GET_REJECTED_REC: "getRejectedRec",

    //process cheque api calls
    GET_PROCESSED_CHEQUES: "getProcessCheques",

    //post url methods
    POST_LOGIN: "login",
    //process cheque api calls
    POST_SCANNED_CHEQUES: "processCheques",
    POST_REJECTED_CHEQUES: "postRejectedChqe",
    POST_REVIEW_CHEQUES: "postReviewChqe",
    POST_SMS: "postSms",
    POST_SUCCESS_CHEQUES: "postSuccessChqe"
}

