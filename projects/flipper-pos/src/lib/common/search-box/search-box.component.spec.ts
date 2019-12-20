import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBoxComponent } from './search-box.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlipperComponentsModule } from '@enexus/flipper-components';
import { VendorsModule } from '@enexus/flipper-vendors';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';

describe('SearchBoxComponent', () => {
  let component: SearchBoxComponent;
  let fixture: ComponentFixture<SearchBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[ 
        FormsModule,
        FlipperComponentsModule,
        ReactiveFormsModule,
        VendorsModule],
      declarations: [ SearchBoxComponent,AutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initialize ngOnInit', () => {
    component.ngOnInit();
  });

    it('should search product from input', () => {
    
      const fixture = TestBed.createComponent(SearchBoxComponent);
      const app=fixture.debugElement.componentInstance;
      const el = fixture.nativeElement.querySelector('input');
      el.value ='ganza';
      dispatchEvent(new Event(el));
      fixture.detectChanges();
      fixture.whenStable().then(()=>{expect(app.data).toBe('newvalue');
    });

  });
});