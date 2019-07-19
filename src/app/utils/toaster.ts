import { ToastrManager } from 'ng6-toastr-notifications';
import { Injectable } from '@angular/core';

@Injectable()
export class Toaster {

    constructor(public toastr: ToastrManager) {
    }

    // To display error notification
    showError(toaster_result: any) {
        this.toastr.errorToastr(toaster_result, 'Error!', {
            showCloseButton: 'true',
            enableHTML: 'true', maxShown: 1, dismiss: 'close'
        });
    }

    // To close the toaster msg
    closeNotification() {
        this.toastr.dismissAllToastr();
    }

    // To display notification
    showSucccessNotification(toaster_result: any) {
        this.toastr.successToastr(toaster_result, 'Success !', {
            showCloseButton: 'true',
            enableHTML: 'true', maxShown: 1, animate: 'fade'
        });
    }

    // To display notification
    showInfoNotification(toaster_result: any) {
        this.toastr.infoToastr(toaster_result, 'Info !', {
            showCloseButton: 'true',
            enableHTML: 'true', maxShown: 1, animate: 'fade'
        });
    }
}
