import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  HostListener
} from '@angular/core';
import {
  Order,
  Variant,
  Shoppings,
  CalculateTotalClassPipe,
  MergeArryByIdPipe,
  ArrayRemoveItemPipe
} from '@enexus/flipper-components';
import {
  BehaviorSubject
} from 'rxjs';
import { DialogService } from '@enexus/flipper-dialog';
@Component({
  selector: 'flipper-basic-pos',
  templateUrl: './flipper-basic-pos.component.html',
  styleUrls: ['./flipper-basic-pos.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[CalculateTotalClassPipe,MergeArryByIdPipe,ArrayRemoveItemPipe]
})
export class FlipperBasicPosComponent  {
  
  @Output() updateQtyEmit = new EventEmitter < Shoppings > ();
  @Output() searchEmitValue = new EventEmitter < string > ();
  @Output() addToCartEmit = new EventEmitter < Variant > ();
  @Output() saveOrderUpdatedEmit = new EventEmitter < Order > ();
  action = '';
  orderItems$ = new BehaviorSubject < Shoppings[] > ([]);

  private canfoundVariant: Variant[] = [];
  private isCurrentOrder: Order = null;
 

  @Input('foundVariant')
  set foundVariant(value: Variant[]) {
    this.canfoundVariant = value;
  }
  get foundVariant(): Variant[] {
    return this.canfoundVariant;
  }

  @Input('currentOrder')
  set currentOrder(order: Order) {
    this.isCurrentOrder = order;
  }

  get currentOrder(): Order {
    return this.isCurrentOrder;
  }

  private setCartFocused:Shoppings=null;
  
  set cartFocused(cart: Shoppings) {
    this.setCartFocused = cart;

  }
  get cartFocused(): Shoppings {
    return this.setCartFocused;
  }

  @HostListener('document:keydown', ['$event']) 
  onKeydownHandler(event: KeyboardEvent) {
   console.log(event);

    //delete key
    if(this.cartFocused){
    if(event.keyCode===46){
        this.removeItem(this.cartFocused);
      }
      if(event.shiftKey && event.keyCode===187){ //shift + (+)
        this.updateQuantity(this.cartFocused,'+');
      }

      if(event.shiftKey && event.keyCode===189){//shift + (-)
        this.updateQuantity(this.cartFocused,'-');
      }
     
    }
    if(event.shiftKey && event.keyCode===75){//shift + k
      this. keyBoardShortCuts();
    }
  }

  constructor(
    public dialog:DialogService,
    private totalPipe: CalculateTotalClassPipe,
    private mergePipe:MergeArryByIdPipe,
    private removeItemPipe:ArrayRemoveItemPipe) {}

    keyBoardShortCuts(){
      this.dialog.keyBoardShortCuts();
    }

  public searchPosProduct(event) {
    if (event) {
      this.searchEmitValue.emit(event);
    }
  }


  addToCart(variant: Variant) {
    this.addToCartEmit.emit(variant);
  }

  updateQty(item: Shoppings) {
    this.currentOrder.orderItems= this.mergePipe.
    transform<Shoppings>(this.currentOrder.orderItems,[item]);
    this.saveOrderUpdated();
  }

  

  removeItem(item: Shoppings) {
   this.currentOrder.orderItems = this.removeItemPipe.transform<Shoppings>(this.currentOrder.orderItems,item);
      this.saveOrderUpdated();
  }


  saveOrderUpdated(event?: Order) {

    let order=event?event:this.currentOrder;
   
    order.subTotal = this.totalPipe.
    transform<Shoppings>(order.orderItems, 'subTotal');

    order.customerChangeDue = order.cashReceived > 0 ?
    order.cashReceived - order.subTotal : 0.00;

    order.customerChangeDue = order.customerChangeDue;
   
      this.saveOrderUpdatedEmit.emit(order);
  }


  updateQuantity(item: Shoppings, action = null) {
    const lastQty = item.quantity;
    this.action = action;
    if (this.action === '-') {
      item.quantity = item.quantity - 1;
      if (item.quantity < 0) {
        alert('Negative quantity is not allowed.');
        item.quantity = lastQty;
      }
    } else if (this.action === '+') {
      item.quantity = item.quantity + 1;

    }
    item.subTotal = item.price * item.quantity;
    this.updateQty(item);
  }
  canSetCartFocused(item){
    this.cartFocused=item;
  }

}
