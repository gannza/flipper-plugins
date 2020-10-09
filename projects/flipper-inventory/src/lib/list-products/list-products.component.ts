import { Component, OnInit, ViewChild, OnDestroy, Input, NgZone } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product, Stock, CalculateTotalClassPipe, Variant,
   MigrateService, PouchConfig, PouchDBService, Tables,
    StockHistory } from '@enexus/flipper-components';

    
import { Subscription, async } from 'rxjs';
import { VariationService } from '../services/variation.service';
import { StockService } from '../services/stock.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'flipper-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ListProductsComponent implements OnInit, OnDestroy {

  readonly displayedColumns: string[] = ['name', 'sku', 'soldby', 'inStock', 'retailprice', 'supplyprice'];
  loading = true;
  dataSource: MatTableDataSource<Product>;
  expandedElement: Product | null;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  private subscription: Subscription;

  searching: string;
  @Input('applySearch')
  set applySearch(value: string) {
    this.searching = value;
    this.applyFilter(value);
  }

  get applySearch(): string {
    return this.searching;
  }

   constructor(private router: Router,
              private totalPipe: CalculateTotalClassPipe,
              private stock: StockService,
              public variant: VariationService,
              private migrate: MigrateService,
              private database: PouchDBService,
              public product: ProductService, 
              private ngZone: NgZone) {
    this.database.connect(PouchConfig.bucket);
    this.dataSource = new MatTableDataSource([]);
 
    this.subscription = this.product.productsSubject.
    subscribe((loadAllProducts) => this.loadAllProducts = loadAllProducts);
   }

   async ngOnInit() {
     
    if (PouchConfig.canSync) {
      this.database.sync(PouchConfig.syncUrl);
    }
    await this.variant.activeBusiness();
    await this. variant.variations();
    if(this.variant.defaultBusiness){
      await this.refresh();
    }
   
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async refresh() {
    this.loading = true;
 
    await this.product.loadAllProducts(this.variant.defaultBusiness.id);
    this.loadAllProducts= await this.product.products;
  }

  applyFilter(filterValue: string) {
    if (filterValue) {
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    } else {
      this.loadAllProducts=  this.product.products;
    }

  }




  set loadAllProducts(hosts: Product[]) {
 const data=[];
 let products=[];
  if(hosts.length > 0){
    hosts.forEach(product=>{
      data['product']=product;
      data['allVariant']=this.variant.allVariants.filter(res=>res.productId==product.id);
      products.push(data);
    });
  }
  console.log(products);
    this.dataSource = new MatTableDataSource(hosts);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.loading = false;
  }

  editProduct(product: Product) {
    product.isDraft = true;
    product.isCurrentUpdate = true;
    this.migrate.insertDataIntoAlsql<Product>(Tables.products, product, product.id);
    this.router.navigate(['/add/product']);
  }


  getTotalStock(product: Product): number {
        if (this.getStock(product).length > 0) {
          return this.totalPipe.transform(this.getStock(product), 'currentStock');
        } else {
            return 0;
        }
    }

     getStock(product: Product){
      const stocks: Stock[] = [];
       this.variant.allVariant(product);
      if (this.variant.allVariants.length > 0) {
        this.variant.allVariants.forEach(async variant => {
          await this.stock.findVariantStock(variant.id);
                  stocks.push(this.stock.stock);
                });
            }
      return stocks;
    }

    allVariant(product: Product){
      const variants: Variant[] = [];

          this.variant.allVariant(product);
          if (this.variant.allVariants.length > 0) {
            this.variant.allVariants.forEach( variant => {
      
                     variants.push(variant);
                     
                  });
                }
          return variants;
    }



    getStockPrice(product: Product, type: string): any {
        if (this.getStock(product).length > 0) {
              if (this.getStock(product).length > 1) {
                  return this.getStock(product).length + ' Prices';
              } else {
                return this.variant.defaultBusiness.currency + ' ' + this.getStock(product)[0][type];
              }
          } else {
              return 0;
          }

      }

}
