import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core'
import { ProductService } from '../services/product.service'
import {
  Product,
  Stock,
  CalculateTotalClassPipe,
  Variant,
  PouchConfig,
  PouchDBService,
  AnyEvent,
} from '@enexus/flipper-components'

import { Subscription, async } from 'rxjs'
import { VariationService } from '../services/variation.service'
import { StockService } from '../services/stock.service'
import { trigger, state, style, transition, animate } from '@angular/animations'
import { Router } from '@angular/router'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { FlipperEventBusService } from '@enexus/flipper-event'

@Component({
  selector: 'flipper-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ListProductsComponent implements OnInit, OnDestroy {
  readonly displayedColumns: string[] = ['name', 'sku', 'soldby', 'inStock', 'retailprice', 'supplyprice']
  loading = true
  dataSource: MatTableDataSource<Product>
  expandedElement: Product | null

  @ViewChild(MatSort, { static: true }) sort: MatSort
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  private subscription: Subscription

  searching: string
  @Input('applySearch')
  set applySearch(value: string) {
    this.searching = value
    this.applyFilter(value)
  }

  get applySearch(): string {
    return this.searching
  }

  constructor(
    private router: Router,
    private totalPipe: CalculateTotalClassPipe,
    private stock: StockService,
    public variant: VariationService,
    private database: PouchDBService,
    private eventBus: FlipperEventBusService,
    public product: ProductService
  ) {
    this.database.connect(PouchConfig.bucket,localStorage.getItem('userId'));
    this.dataSource = new MatTableDataSource([])

    this.subscription = this.product.productsSubject.subscribe(
      loadAllProducts => (this.loadAllProducts = loadAllProducts)
    )

    this.eventBus
    .of<AnyEvent>(AnyEvent.CHANNEL)
    .subscribe(res => {
      this.init();
    })
  }

   ngOnInit() {
  
     this.init();
  
    // let async: any =   this.database.sync([localStorage.getItem('userId')]);
    // async
    // .on('change',  (info: any)  => {
    //   console.log('chanel',localStorage.getItem('userId'));
    //   console.log(info);
    //         this.init();
    // })
    // .on('paused', (err: any) => {
    //   console.log('sync paused', err)
    // })
    // .on('active', () => {
    //   console.log('sync active')
    // })
    // .on('denied', (err: any) => {
    //   console.log('denied', err)
    // })
    // .on('complete', (info: any) => {
    //   console.log('sync complete')
    // })
    // .on('error', err => {
    //   console.log('sync error', err)
    // })
    
 
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
  
async init(){
  await this.variant.activeBusiness();
  await this. variant.variations();
  await this.stock.allStocks();
  if(this.variant.defaultBusiness){
    await this.refresh();
  }
}
  async refresh() {
    this.loading = true

    await this.product.loadAllProducts(this.variant.defaultBusiness.id)
    this.loadAllProducts = await this.product.products
  }

  applyFilter(filterValue: string) {
    if (filterValue) {
      this.dataSource.filter = filterValue.trim().toLowerCase()

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage()
      }
    } else {
      this.loadAllProducts = this.product.products
    }
  }

  set loadAllProducts(hosts: Product[]) {
    const data = []
    let products = []
    if (hosts.length > 0) {
      hosts.forEach(product => {
        console.log(product);
       
        product['allVariant'] = this.variant.allVariants.filter(res => res.productId == product.id)
        product['stocks'] = this.stock.stocks.filter(res => res.productId == product.id)
        products.push(product);
        
      })
    }

    this.dataSource = new MatTableDataSource(products)
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator
    this.loading = false
  }

  async editProduct(product: Product) {
    product.isDraft = true
    product.isCurrentUpdate = true
    this.product.hasDraftProduct = product
    await this.product.update()
    await this.router.navigate(['/add/product'])
  }

  getTotalStock(stocks: Stock[]): number {
    if (stocks.length > 0) {
      return this.totalPipe.transform(stocks, 'currentStock')
    } else {
      return 0
    }
  }

  getStock(product: Product) {
    const stocks: Stock[] = []
    this.variant.allVariant(product)
    if (this.variant.allVariants.length > 0) {
      this.variant.allVariants.forEach(async variant => {
        await this.stock.findVariantStock(variant.id)
        stocks.push(this.stock.stock)
      })
    }
    return stocks
  }

  allVariant(product: Product) {
    const variants: Variant[] = []

    this.variant.allVariant(product)
    if (this.variant.allVariants.length > 0) {
      this.variant.allVariants.forEach(variant => {
        variants.push(variant)
      })
    }
    return variants
  }

  getStockPrice(stocks, type: string): any {
    if (stocks.length > 0) {
      if (stocks.length > 1) {
        return stocks.length + ' Prices'
      } else {
        return this.variant.defaultBusiness.currency + ' ' + (stocks && stocks.length > 0?stocks[0][type]:0);
      }
    } else {
      return this.variant.defaultBusiness.currency + ' ' + 0
    }
  }
}
