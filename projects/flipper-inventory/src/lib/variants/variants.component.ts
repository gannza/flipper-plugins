import { Component, OnInit, Input } from '@angular/core';
import { Product } from '@enexus/flipper-components';
import { VariationService } from '../services/variation.service';

@Component({
  selector: 'flipper-variants',
  templateUrl: './variants.component.html',
  styleUrls: ['../create-product/create-product.component.css']
})
export class VariantsComponent implements OnInit {
 

products: Product;
@Input('product')
set product(bol:Product){
this.products=bol;
}
get product():Product{
return this.products;
}


addNew:boolean=false;

@Input('didAddNew')
set didAddNew(bol:boolean){
this.addNew=bol;
this.refresh();
}
get didAddNew():boolean{
return this.addNew;
}
  constructor(public variant: VariationService) {}

  ngOnInit() {

   this.refresh();

  }

  refresh(){
    if (this.product) {
      this.variant.init(this.product);
  }

  }

}