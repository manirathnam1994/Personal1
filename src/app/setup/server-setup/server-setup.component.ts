import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ServerSetupDetails } from '../../model/server-setup';
import { RequestResponseService } from '../../requestresponse/req-res';
import { Toaster } from '../../utils/toaster';
import { Constants } from 'src/app/utils/constants';
import { UtilServices } from '../../utils/utilSevices';

@Component({
    selector: 'app-server-setup',
    templateUrl: './server-setup.component.html',
    styleUrls: ['./server-setup.component.css']
})

export class ServerSetupComponent implements OnInit {

    serverSetupForm: FormGroup;
    public data: ServerSetupDetails[];
    toasterResult: string;
    submitted = false;
    formValueSno: number;
    UpdateformValue = {};
    updateFunction = false;
    prevValues = {};
    displayLoader: boolean;
    server: string;
    host: string;
    username: string;
    password: string;
    scriptpath: string;
    prevServer: string;
    editIconHide=false;
    deleteIconHide=false;

    constructor(private bs: RequestResponseService, private toaster: Toaster, private fb: FormBuilder, private utilServices: UtilServices) {
        this.createForm();
    }

    get formValues() {
        return this.serverSetupForm.controls;
    }

    // To make initial load
    ngOnInit(): void {
        // To close the error notification if any toaster present
        this.toaster.closeNotification();
        // To display server setup details
        this.data = [];
        this.bs.getServer().subscribe((res: ServerSetupDetails[]) => {
            if (res[0].message === Constants.SUCCESS_MSG) {
                for (const output of res) {
                    this.data.push(output);
                }
            } else if (res[0].message === Constants.READ_SERVER_EMPTY_MSG) {
                this.data = [];
            } else if (res[0].message !== null || res[0].message !== '') {
                this.toasterResult = res[0].message;
                return this.toaster.showError(this.toasterResult);
            }
        });
    }

    createForm() {
        this.serverSetupForm = this.fb.group({
            server: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', Validators.required],
            host: ['', Validators.required],
            scriptpath: ['', Validators.required]
        });
    }

    onSubmit() {
        this.submitted = true;
    }

    // To write Server setup details in json file
    writeServerSetup(server: string, host: string, uName: string, pwd: string, sPath: string) {

        server = server.trim();
        host = host.trim();
        uName = uName.trim();
        pwd = pwd.trim();
        sPath = sPath.trim();

        this.toasterResult = '';
        this.displayLoader = true;
        this.bs.writeServerSetup(server, host, uName, pwd, sPath).subscribe((res: ServerSetupDetails[]) => {
            this.displayLoader = false;
            if (res[0].message === Constants.SUCCESS_MSG) {
                this.data = [];
                this.reset();
                let sucecssMsg = Constants.RECORD_INSERT_SUCCESS_MSG;
                for (const output of res) {
                    this.data.push(output);
                }
                this.toasterResult = sucecssMsg;
                return this.toaster.showSucccessNotification(this.toasterResult);
            } else if (res[0].message !== null || res[0].message !== '') {
                this.toasterResult = res[0].message;
                return this.toaster.showError(this.toasterResult);
            }
        });
    }

    // To resert from fields
    reset() {
        this.serverSetupForm.reset();
        this.submitted = false;
        this.toaster.closeNotification();
    }

    // To edit list values
    displayServerSetupDataForEdit(values) {

        let formValue = {};
        formValue = values;
        this.prevValues = values;
        this.formValueSno = values.sno;

        this.bs.editServerMQCheck(values).subscribe((res: ServerSetupDetails[]) => {
            if (res[0].message === Constants.SERVER_MAPPED_MSG) {
                this.toasterResult = res[0].message;
                return this.toaster.showError(this.toasterResult);
            }
            else {
                this.utilServices.showButton(Constants.UPDATE);
                this.serverSetupForm.patchValue(formValue);
                //To hide edit & delete icon on edit operation
                this.editIconHide=true;
                this.deleteIconHide=true;
            }
        });
    }

    // To update the list values
    updateServerData(sno: number) {
        //To show edit & delete icon after save operation
        this.editIconHide=false;
        this.deleteIconHide=false;
        const server = this.serverSetupForm.value.server;
        this.server = server.toString();
        this.host = this.serverSetupForm.value.host;
        this.username = this.serverSetupForm.value.username;
        this.password = this.serverSetupForm.value.password;
        this.scriptpath = this.serverSetupForm.value.scriptpath;
        this.server = this.server.trim();
        this.host = this.host.trim();
        this.username = this.username.trim();
        this.password = this.password.trim();
        this.scriptpath = this.scriptpath.trim();
        if (this.serverSetupForm.invalid) {
            this.toasterResult = '';
            const formResult = new Map([['Server', this.serverSetupForm.value.server], ['Host', this.serverSetupForm.value.host], ['UserName', this.serverSetupForm.value.username],
            ['Password', this.serverSetupForm.value.password], ['Script Path', this.serverSetupForm.value.scriptpath]]);
            formResult.forEach((value, key) => {
                if (value === '' || value === null) {
                    this.toasterResult += Constants.TOASTER_STAR + key + Constants.SPACE + Constants.TOASTER_APPEND_MSG + Constants.NXT_LINE_APPENDER;
                }
            });
            return this.toaster.showError(this.toasterResult);
        }
        else {
            this.displayLoader = true;
            this.bs.editServer(sno, this.server, this.host, this.username, this.password, 
            this.scriptpath, this.prevValues).subscribe((res: ServerSetupDetails[]) => {
            this.displayLoader = false;
            if (res[0].message === Constants.SUCCESS_MSG) {
                    this.data = [];
                    this.reset();
                    for (const output of res) {
                        this.data.push(output);
                    }
                    this.utilServices.showButton(Constants.ADD);
                    this.toasterResult = Constants.UPDATE_SUCCESS_MSG;
                    return this.toaster.showSucccessNotification(this.toasterResult);
                } else if (res[0].message === Constants.MODIFIED_ERR) {
                    this.data = [];
                    this.reset();
                    for (const output of res) {
                        this.data.push(output);
                    }
                    this.utilServices.showButton(Constants.ADD);
                    this.toasterResult = Constants.MODIFIED_ERR;
                    return this.toaster.showInfoNotification(this.toasterResult);
                } else if (res[0].message !== null || res[0].message !== '') {
                    this.utilServices.showButton(Constants.UPDATE);
                    this.toasterResult = res[0].message;
                    return this.toaster.showError(this.toasterResult);
                }
            });
        }
    }

    // To delete the list values
     onDelete(data: any, sno: number, server: string) {
        let len = data.length
        this.bs.deleteServerMQCheck(len, sno, server, data).subscribe((res: ServerSetupDetails[]) => {
            let serverDel = server.toString();
            if (res[0].message === Constants.SUCCESS_MSG) {
                if (confirm(Constants.DELETE_CNF_MSG) === true) {
                     this.bs.deleteServer(len, sno, server, data).subscribe((res: ServerSetupDetails[]) => {
                     this.data = [];
                    
                    let deleteSuccessMsg = Constants.OPEN_BRACKET + serverDel + Constants.CLOSE_BRACKET + Constants.SPACE + Constants.DELETE_SUCCESS;
                    for (const output of res) {
                        this.data.push(output);
                    }
                     if (res[0].message === Constants.SUCCESS_MSG) {
                    this.toasterResult = deleteSuccessMsg;
                    return this.toaster.showSucccessNotification(this.toasterResult);
              }
             else if (res[0].message === Constants.READ_SERVER_EMPTY_MSG) {
                this.data = [];
               }
            else if (res[0].message === Constants.MODIFIED_ERR) {
                this.data = [];
                this.reset();
                for (const output of res) {
                    this.data.push(output);
                }
                this.toasterResult = Constants.MODIFIED_ERR;
                return this.toaster.showInfoNotification(this.toasterResult);
            }
            else if(res[0].message ===  serverDel+Constants.MODIFIED_ERR){
                    this.data = [];
                    this.reset();
                    for (const output of res) {
                        this.data.push(output);
                    }
                    this.toasterResult = Constants.OPEN_BRACKET + serverDel + Constants.CLOSE_BRACKET
                        + Constants.SPACE+ Constants.MODIFIED_ERR;
                    return this.toaster.showInfoNotification(this.toasterResult);
                }	                
            else if (res[0].message !== null || res[0].message !== '') {
                this.toasterResult = res[0].message;
                return this.toaster.showError(this.toasterResult);
            }
        });
          }
          }
          else if (res[0].message === Constants.MODIFIED_ERR) {
                this.data = [];
                this.reset();
                for (const output of res) {
                    this.data.push(output);
                }
                this.toasterResult = Constants.MODIFIED_ERR;
                return this.toaster.showInfoNotification(this.toasterResult);
            }
             else if(res[0].message ===  serverDel+Constants.MODIFIED_ERR){
                    this.data = [];
                    this.reset();
                    for (const output of res) {
                        this.data.push(output);
                    }
                    this.toasterResult = Constants.OPEN_BRACKET + serverDel + Constants.CLOSE_BRACKET
                        + Constants.SPACE+ Constants.MODIFIED_ERR;
                    return this.toaster.showInfoNotification(this.toasterResult);
                }	           
           else if (res[0].message !== null || res[0].message !== '') {
                this.toasterResult = res[0].message;
                return this.toaster.showError(this.toasterResult);
            }
          });         

    }

    // Action on add button
    addServerSetupData() {
        this.toasterResult = '';
        const server = this.serverSetupForm.controls.server.value;
        const host = this.serverSetupForm.controls.host.value;
        const uName = this.serverSetupForm.controls.username.value;
        const pwd = this.serverSetupForm.controls.password.value;
        const sPath = this.serverSetupForm.controls.scriptpath.value;

        if (this.serverSetupForm.invalid) {
            this.toasterResult = '';
            const formResult = new Map([['Server', server], ['Host', host], ['UserName', uName],
            ['Password', pwd], ['Script Path', sPath]]);
            formResult.forEach((value, key) => {
                if (value === '' || value === null) {
                    this.toasterResult += Constants.TOASTER_STAR + key + Constants.SPACE + Constants.TOASTER_APPEND_MSG + Constants.NXT_LINE_APPENDER;
                }
            });
            return this.toaster.showError(this.toasterResult);
        } else {
            this.writeServerSetup(server, host, uName, pwd, sPath);
            return this.toaster.closeNotification();
        }
    }

    // To handle action on cancel button click
    cancel() {
        //To show edit & delete icon on cancel operation
        this.editIconHide=false;
        this.deleteIconHide=false;
        // To perform button operations
        this.utilServices.showButton(Constants.ADD);
        this.reset();
    }
}
