//$Id:  $
//$Revision:  $
//$Date:  $

/*
 * +=======================================================================+
 * |                                                                       |
 * |          Copyright (C) 2018-2019 Nomura Securities Co., Ltd.          |
 * |                          All Rights Reserved                          |
 * |                                                                       |
 * |    This document is the sole property of Nomura Securities Co.,       |
 * |    Ltd. No part of this document may be reproduced in any form or     |
 * |    by any means - electronic, mechanical, photocopying, recording     |
 * |    or otherwise - without the prior written permission of Nomura      |
 * |    Securities Co., Ltd.                                               |
 * |                                                                       |
 * |    Unless required by applicable law or agreed to in writing,         |
 * |    software distributed under the License is distributed on an        |
 * |    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,       |
 * |    either express or implied.                                         |
 * |                                                                       |
 * +=======================================================================+
 */

import { Component, OnInit } from '@angular/core';
import { Column, GridOption } from 'angular-slickgrid';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    columnDefinitions: Column[] = [];
    gridOptions: GridOption = {};
    dataset: any[] = [];
    rowData: object[];
    openMenu: boolean = true;
    closeMenu: boolean;
    gridHeight: number;
    constructor(private router: Router) {
    }
    ngOnInit(): void {
        this.router.navigate(['/dashboard']);
        const menu = document.getElementById('main-menu');
        menu.style.display = 'none';
        this.openMenu = true;
        this.closeMenu = false;
    }

    // To open and close the menu  and set menu height based on window.
    openBlockOnClick() {
        this.gridHeight = window.innerHeight;
        const menu = document.getElementById('main-menu');
        if (menu.style.display !== 'block') {
            menu.style.display = 'block';
            this.openMenu = false;
            this.closeMenu = true;
        } else {
            menu.style.display = 'none';
            this.openMenu = true;
            this.closeMenu = false;
        }
    }

    // To close the menu.
    hideMenu() {
        const menu = document.getElementById('main-menu');
        menu.style.display = 'none';
        this.openMenu = true;
        this.closeMenu = false;
    }
}
