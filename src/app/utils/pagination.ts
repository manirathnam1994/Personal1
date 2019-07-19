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

import * as _ from 'underscore';

export class PaginationService {
    getPager( totalItems: number, currentPages: number, pageSize: number = 20 ) {
        const totalPages = Math.ceil( totalItems / pageSize );
        let startPage: number;
        let endPage: number;
        let currentPage: number;
        currentPage = Math.ceil( currentPages );
        if ( totalPages <= 5 ) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if ( currentPage <= 3 ) {
                startPage = 1;
                endPage = 5;
            } else if ( currentPage + 1 >= totalPages ) {
                startPage = totalPages - 4;
                endPage = totalPages;
            } else {
                startPage = currentPage - 2;
                endPage = currentPage + 2;
            }
        }

        const startIndex = ( currentPage - 1 ) * pageSize;
        const endIndex = Math.min( startIndex + pageSize - 1, totalItems - 1 );

        const pages = _.range( 1 );
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }
}
