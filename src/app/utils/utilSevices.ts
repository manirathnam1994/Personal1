import { Injectable } from '@angular/core';
declare let $: any;
import { Constants } from './constants';

@Injectable()
export class UtilServices {

    // To show buttons based on condition
    showButton(buttonValue: string) {
        if (buttonValue === Constants.ADD) {
            $('#updateBtn').hide();
            $('#cancelBtn').hide();
            $('#AddBtn').show();
            $('#ResetBtn').show();
        } else if (buttonValue === Constants.UPDATE) {
            $('#updateBtn').show();
            $('#cancelBtn').show();
            $('#AddBtn').hide();
            $('#ResetBtn').hide();
        }
    }
}