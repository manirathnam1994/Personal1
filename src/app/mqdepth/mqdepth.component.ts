import { Component, ViewChild, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import { RequestResponseService } from '../requestresponse/req-res';
import { MQDepthQueryDetails } from '../model/mqdepth-query-res';
declare let $: any;
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Column, GridOption, AngularGridInstance, GridService } from 'angular-slickgrid';
import { PaginationService } from '../utils/pagination';
import { ScreenDropDown } from '../model/screen-dropdown';
import { Toaster } from '../utils/toaster';
import { Constants } from '../utils/constants';

@Component({
    selector: 'app-queue-depth',
    templateUrl: './mqdepth.component.html',
    styleUrls: ['./mqdepth.component.css'],
    encapsulation: ViewEncapsulation.None,
})

export class MQDepthComponent implements OnInit {
    mqDepthQueryForm: FormGroup;
    status: boolean;
    displayLoader: boolean;
    submitted = false;
    showGrid: boolean;
    gridHeight: number;
    pager: any = {};
    size: number;
    result: MQDepthQueryDetails[];
    angularGrid: AngularGridInstance;
    slick: any;
    checkboxDisabled = false;
    showAllQueue = false;
    checkBoxClick = false;
    userCheck: boolean;
    userCheckPrvPrf: boolean;
    @ViewChild('containerBodyId') containerBodyId: ElementRef;
    columnDefinitions: Column[] = [];
    gridOptions: GridOption = {};
    dataset: any[];
    environments: string[];
    grid: any;
    gridService: GridService;
    dataView: any;
    temp: any;

    constructor(private bs: RequestResponseService, private fb: FormBuilder, private toaster: Toaster,
        private pagerService: PaginationService
    ) {
        this.createForm();
    }


    // To make initial load
    ngOnInit(): void {
        // To close the error notification if any toaster present
        this.toaster.closeNotification();
        // To display environment dropdown values
        this.environments = [];

        this.bs.getEnvDropDown().subscribe((res: ScreenDropDown[]) => {
            for (const dropdown of res) {
                this.environments.push(dropdown.keys);
            }
        });

        // To calculate grid height
        this.gridHeight = window.innerHeight;
        this.showGrid = false;
        // Grid column definitions
        this.columnDefinitions = [
            { id: 'id', name: 'S.No.', field: 'id', sortable: true },
            { id: 'physicalQueueName', name: 'Queue Name', field: 'physicalQueueName', sortable: true },
            { id: 'queueDepth', name: 'Queue Depth', field: 'queueDepth', sortable: true },
            { id: 'logicalQueueName', name: 'JMS Properties', field: 'logicalQueueName', sortable: true }
        ];

        this.gridOptions = {
            gridId: 'mqDepthGrid',
            enableAutoResize: true,
            enableCellNavigation: true,
            rowHeight: 23,
            headerRowHeight: 10,
            autoResize: {
                maxHeight: this.gridHeight - 350,
                bottomPadding: 62
            }
        };

        this.dataset = [];
    }

    // To send the request to the server
    getGridData(queue: string, environment: string, enableAllq: boolean) {
        let toasterResult: string;
        if (queue !== '' && queue !== null) {
            queue = queue.trim();
        }
        environment = environment.trim();
        this.dataset = [];
        this.submitted = true;
        this.displayLoader = true;
        this.showGrid = true;
        this.dataset = [{
            id: ' ', physicalQueueName: ' ', queueDepth: ' ', logicalQueueName: ' '
        }];

        this.bs.getGridData(queue, environment, enableAllq).subscribe((res: MQDepthQueryDetails[]) => {
            this.displayLoader = false;
            this.result = res;
            if (res[0].errorCode === null || res[0].errorCode === ' ') {
                this.dataset = this.setPage(1);
            } else {
                if (res[0].error === 'No Records found') {
                    this.result = [];
                    this.dataset = this.setPage(0);
                    this.slick.invalidateAllRows();
                    $('#' + this.gridOptions.gridId
                    ).find('.grid-canvas').html('<div align="center" style="color:red;font-size: 20px;">No Record Found</div>');
                } else {
                    toasterResult = res[0].error;
                    return this.toaster.showError(toasterResult);
                }
            }
        });
        this.status = true;
    }

    // To enable grid actions
    angularGridReady(angularGrid: AngularGridInstance) {
        this.angularGrid = angularGrid;
        this.dataView = angularGrid.dataView;
        this.grid = angularGrid.slickGrid;
        this.changeRowBackgroundColor();
    }

    // To validate the input given by user.
    createForm() {
        this.mqDepthQueryForm = this.fb.group({
            queue: ['', Validators.required],
            environment: ['', Validators.required],
        });
    }

    // To make a server call
    onSubmit() {
        let toasterResult: string;
        this.pager = '';
        this.showGrid = false;
        this.submitted = true;
        this.dataset = [];
        const queue = this.mqDepthQueryForm.controls.queue.value;
        const environment = this.mqDepthQueryForm.controls.environment.value;
        const enableAllq = this.showAllQueue;

        // stop here if form is invalid
        if (this.mqDepthQueryForm.invalid) {
            toasterResult = '';
            if (environment === '' || environment === null) {
                const formResult = new Map([['Environment', environment]]);
                formResult.forEach((value, key) => {
                    if (value === '' || value == null) {
                        toasterResult += Constants.TOASTER_STAR + key + Constants.SPACE + Constants.TOASTER_APPEND_MSG + Constants.NXT_LINE_APPENDER;
                    }
                });
                return this.toaster.showError(toasterResult);
            } else {
                this.getGridData(queue, environment, enableAllq);
                return this.toaster.closeNotification();
            }
        } else {
            this.getGridData(queue, environment, enableAllq);
            return this.toaster.closeNotification();
        }
    }

    // Reset the screen
    reset() {
        this.dataset = [];
        this.displayLoader = false;
        this.submitted = false;
        this.mqDepthQueryForm.reset();
        this.showGrid = false;
        this.userCheck = false;
        this.pager = '';
        this.showAllQueue = false;
        this.checkboxDisabled = false;
        this.toaster.closeNotification();
    }

    // To handle pagination
    setPage(page: number): any[] {
        this.size = this.result.length;
        this.pager = this.pagerService.getPager(this.size, page);
        this.dataset = this.result.slice(this.pager.startIndex, this.pager.endIndex + 1);
        return this.dataset;
    }

    // ShowAllQueue Check and unCheck
    disableCheckbox(e) {
        if (e.target.checked) {
            this.showAllQueue = true;
            this.userCheck = true;
            this.userCheckPrvPrf = this.userCheck;
        } else {
            this.showAllQueue = false;
            this.userCheck = false;
            this.userCheckPrvPrf = this.userCheck;
        }
    }

    // To disable ShowAllQueue Checkbox based on queue field input
    onKeyPress(val: string) {
        this.userCheck = false;
        if (val.length > 0) {
            this.checkboxDisabled = true;
            this.userCheck = true;
            this.showAllQueue = true;
        } else {
            this.checkboxDisabled = false;
            if (this.userCheckPrvPrf === true) {
                this.userCheck = true;
                this.showAllQueue = true;
            }
            if (this.checkBoxClick) {
                this.showAllQueue = true;
            } else if (this.userCheckPrvPrf !== true) {
                this.showAllQueue = false;
            }
        }
    }

    showEmptyEnvAlert() {
        if (this.environments.length === 0) {
            this.toaster.showInfoNotification(Constants.ADD_ENV_MSG);
        }
    }

    // To get the control of formvalues
    get formValues() {
        return this.mqDepthQueryForm.controls;
    }
    /**
     * To change the background color of rows based on LogicalQueueName
     */
    changeRowBackgroundColor() {
        this.dataView.getItemMetadata = this.updateItemMetadata(this.dataView.getItemMetadata);
        this.grid.invalidate();
        this.grid.render();
    }

    /**
     * Change the SlickGrid Item Metadata, we will add a CSS class on all rows with a LogicalQueueName not Undefined
     */
    updateItemMetadata(previousItemMetadata: any) {

        const rowCssClass = 'grid-Row';
        const undefinedRowCssClass = 'grid-UndefinedRow';
        return (rowNumber: number) => {
            const item = this.dataView.getItem(rowNumber);
            let meta = {
                cssClasses: ''
            };
            if (typeof previousItemMetadata === 'object') {
                meta = previousItemMetadata(rowNumber);
            }
            if (meta && item && item.logicalQueueName) {
                if (item.logicalQueueName !== ' ' && item.logicalQueueName !== null) {
                    if (item.logicalQueueName !== 'Undefined') {
                        meta.cssClasses = (meta.cssClasses || '') + ' ' + undefinedRowCssClass;
                    } else {
                        meta.cssClasses = (meta.cssClasses || '') + ' ' + rowCssClass;
                    }
                }
            }
            return meta;
        };
    }
}
