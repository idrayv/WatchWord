﻿import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { PaginationService } from '../global/components/pagination/pagination.service';
import { MaterialModel } from '../material/material.models';

@Injectable()
export class MaterialsPaginationService extends PaginationService<MaterialModel>{
    constructor(http: Http) {
        super(http, 'materials');
    }
}