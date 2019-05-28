import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { Generation } from 'app/features/aagt/data';
import { GenMgrUowService } from '../gen-mgr-uow.service';

@Component({
    selector: 'app-gen-detail',
    templateUrl: './gen-detail.component.html',
    styleUrls: ['./gen-detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class GenListDetailComponent implements OnInit, OnDestroy {
    generation: Generation;
    pageType: string;
    productForm: FormGroup;

    private unsubscribeAll: Subject<any>;

    constructor(
        private genMgrUow: GenMgrUowService,
        private formBuilder: FormBuilder,
        private location: Location,
        private matSnackBar: MatSnackBar
    ) {
        this.unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        // Subscribe to update product on changes
        // this._ecommerceProductService.onProductChanged
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(product => {
        //         if (product) {
        //             this.product = new Product(product);
        //             this.pageType = 'edit';
        //         } else {
        //             this.pageType = 'new';
        //             this.product = new Product();
        //         }
        //         this.productForm = this.createProductForm();
        //     });
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    createProductForm(): FormGroup {
        return this.formBuilder.group({
            id: new FormControl()
            // name: [this.product.name],
            // handle: [this.product.handle],
            // description: [this.product.description],
            // categories: [this.product.categories],
            // tags: [this.product.tags],
            // images: [this.product.images],
            // priceTaxExcl: [this.product.priceTaxExcl],
            // priceTaxIncl: [this.product.priceTaxIncl],
            // taxRate: [this.product.taxRate],
            // comparedPrice: [this.product.comparedPrice],
            // quantity: [this.product.quantity],
            // sku: [this.product.sku],
            // width: [this.product.width],
            // height: [this.product.height],
            // depth: [this.product.depth],
            // weight: [this.product.weight],
            // extraShippingFee: [this.product.extraShippingFee],
            // active: [this.product.active]
        });
    }

    saveProduct(): void {
        this.matSnackBar.open('Product saved', 'OK', {
            verticalPosition: 'top',
            duration: 2000
        });
    }

    addProduct(): void {}
}
