import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { FlipperMenuComponent } from './flipper-menu.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FlipperComponentsModule, Business } from '@enexus/flipper-components'
const business = [
  {
    id: 1,
    name: 'Progress Pharamcy',
    active: true,
  },
  {
    id: 2,
    name: 'My Shop',
    active: false,
  },
  {
    id: 3,
    name: 'Dom',
    active: false,
  },
  {
    id: 4,
    name: 'Gy',
    active: false,
  },
]

const mocUser = {
  id: 1,
  name: 'Ganza respice',
  email: 'respinho2014@gmail.com',
}

const MocMenuEntries = {
  user: {
    id: 1,
    name: 'Ganza respice',
    email: 'respinho2014@gmail.com',
  },
  businesses: [
    {
      id: 1,
      name: 'Progress Pharamcy',
      active: true,
    },
    {
      id: 2,
      name: 'My Shop',
      active: false,
    },
    {
      id: 3,
      name: 'Dom',
      active: false,
    },
    {
      id: 4,
      name: 'Gy',
      active: false,
    },
  ],
  branches: [
    {
      id: 1,
      name: 'Kimironko branch',
      active: true,
    },
    {
      id: 2,
      name: 'Nyamata branch',
      active: false,
    },
    {
      id: 3,
      name: 'KCT branch',
      active: false,
    },
    {
      id: 4,
      name: 'City center branch',
      active: false,
    },
  ],
  menu: [
    {
      id: 1,
      name: 'Analytics',
      icon: 'i',
      route: 'analytics',
      active: true,
    },
    {
      id: 2,
      name: 'Inventory',
      icon: 'i',
      route: 'inventory',
      active: false,
    },
    {
      id: 3,
      name: 'Inventory Count',
      icon: 'i',
      route: 'inventory-count',
      active: false,
    },
    {
      id: 4,
      name: 'Orders',
      icon: 'i',
      route: 'order',
      active: false,
    },
    {
      id: 5,
      name: 'Settings',
      icon: 'i',
      route: 'settings',
      active: false,
    },
  ],
}
describe('FlipperMenuComponent', () => {
  let component: FlipperMenuComponent
  let fixture: ComponentFixture<FlipperMenuComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, FlipperComponentsModule],
      declarations: [FlipperMenuComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FlipperMenuComponent)
    component = fixture.componentInstance
    component.menuEntries = MocMenuEntries
    fixture.detectChanges()
  })
  it('should create flipper menu component', () => {
    expect(component).toBeTruthy()
  })
  it('initialize menu with right variables', () => {
    component.ngOnInit()
  })

  it('should toggle branches', () => {
    component.toggleBranches()
    expect(component.canViewBranches).toBe(true)
  })
  it('should switch business on menu', () => {
    component.switchBusiness(business as Business)

    expect(component.canViewBranches).toBe(false)
    spyOn(component.switchedBusiness, 'emit')
    // expect(component.switchedBusiness.emit).toHaveBeenCalledWith(business[0]);
  })
  it('should switch branch', () => {
    component.switchBranch(MocMenuEntries.branches[0])
  })
  it('should route to menu', () => {
    component.router(MocMenuEntries.menu[0])
  })
  it('should set setting to false when menuSetting is active', () => {
    // TODO: more on tuning this testing
    component.router(MocMenuEntries.menu[0])
  })
  it('should hide branch DropDown', () => {
    component.hideBranchDropDown()
    expect(component.canViewBranches).toBe(false)
  })
  it('should cut words to small lenght', () => {
    const end = component.textEllipsis('helloworld', 2, { side: 'end' })
    expect(end).toBe('helloworl...')

    const start = component.textEllipsis('helloworld', 2, { side: 'start' })
    expect(start).toBe('...elloworld')
  })
  it('should emit log out event', () => {
    component.logout()
    spyOn(component.logoutUser, 'emit')
    const el = fixture.nativeElement
    const logout = el.querySelector('.icon-logout-logout')
    logout.dispatchEvent(new Event('click'))

    expect(component.logoutUser.emit).toHaveBeenCalledWith(mocUser)
  })
  it('should start with menu open', () => {
    component.toggle()
    spyOn(component.menuToggled, 'emit')
    const el = fixture.nativeElement

    const toggleButton = el.querySelector('.toggled-button')
    toggleButton.dispatchEvent(new Event('click'))
    expect(component.menuToggled.emit).toHaveBeenCalledWith(false)
    expect(component.isOpen).toBe(false)
  })
})
