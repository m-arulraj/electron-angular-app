import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VULReportComponent } from './vul-report.component';

describe('VULReportComponent', () => {
  let component: VULReportComponent;
  let fixture: ComponentFixture<VULReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VULReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VULReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
