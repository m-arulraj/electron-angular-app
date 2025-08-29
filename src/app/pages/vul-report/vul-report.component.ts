import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-vul-report',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vul-report.component.html',
  styleUrls: ['./vul-report.component.css']
})
export class VULReportComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      filePath: ['']
    });
  }

  onSubmit() {
    const path = this.form.value.filePath;
    console.log('Entered file path:', path);
    alert(`Entered file path: ${path}`);
  }

  onClear() {
    this.form.reset();
  }
}
