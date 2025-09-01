import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

import {
  CrewService,
  Crew,
  CrewProjectSelectionModel,
  SelectedProject
} from '../crew.service';

import { CrewSelectorComponent, CrewSelectionValue } from '../shared/crew-selector/crew-selector.component';

@Component({
  selector: 'app-crew-project-selector',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, CrewSelectorComponent],
  templateUrl: './crew.component.html',
})
export class CrewComponent implements OnInit {
  form: FormGroup;
  crews: Crew[] = [];
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private crewService: CrewService) {
    this.form = this.fb.group({
      crewSelection: this.fb.control<CrewSelectionValue>({
        crewId: null,
        selectedProjects: [],
        selectedModules: []
      }),
      fileType: [''],
      fieldGroups: this.fb.array([]),
      sourceBranch: [''],
      featureBranch: [''],
      checkOutPath: [''],
      jiraId: [''],
      commitMessage: [''],
      createPr: [false]
    });

    this.addFieldGroup();

    this.form.get('fileType')?.valueChanges.subscribe(value => {
      if (value === 'JF') {
        this.setDefaultFieldsForJF();
      } else {
        this.clearDynamicFields();
      }
    });
  }

  ngOnInit() {
    this.loadCrews();
  }

  loadCrews() {
    this.crewService.getCrews().subscribe({
      next: data => this.crews = data,
      error: err => this.errorMessage = 'Failed to load crews data'
    });
  }

  get fieldGroups(): FormArray {
    return this.form.get('fieldGroups') as FormArray;
  }

  createFieldGroup() {
    return this.fb.group({
      field1: [''],
      field2: [''],
      field3: [''],
      field4: ['']
    });
  }

  addFieldGroup(): void {
    this.fieldGroups.push(this.createFieldGroup());
  }

  mapSelectedProjects(selection: CrewSelectionValue): SelectedProject[] {
    const crew = this.crews.find(c => c.id === selection.crewId);
    if (!crew) return [];

    return crew.projects
      .filter(p => selection.selectedProjects.includes(p.name))
      .map(p => ({
        projectName: p.name,
        modules: p.modules.filter(m => selection.selectedModules.includes(m))
      }));
  }

  onSubmit() {
    if (!this.form.valid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;

    const formValue = this.form.value;
    const crewSelection = formValue.crewSelection;

    const model: CrewProjectSelectionModel = {
      crewId: crewSelection.crewId,
      selectedProjects: this.mapSelectedProjects(crewSelection),
      fileType: formValue.fileType,
      fieldGroups: formValue.fieldGroups,
      sourceBranch: formValue.sourceBranch,
      featureBranch: formValue.featureBranch,
      checkOutPath: formValue.checkOutPath,
      jiraId: formValue.jiraId,
      commitMessage: formValue.commitMessage,
      createPr: formValue.createPr
    };

    console.log('CrewProjectSelectionModel:', model);

    // Uncomment when backend is ready
    /*
    this.crewService.submitCrewSelection(model)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.successMessage = 'Form submitted successfully!';
          this.form.reset({ createPr: false });
          this.fieldGroups.clear();
          this.addFieldGroup();
        },
        error: () => {
          this.errorMessage = 'Failed to submit form. Please try again.';
        }
      });
    */
  }

  setDefaultFieldsForJF(): void {
    this.clearDynamicFields();

    const defaultGroups = [
      { field1: 'PR_BR', field2: '=', field3: '1', field4: 'rele/t' },
      { field1: 'TR_BR', field2: '=', field3: '1', field4: 'stage-test' }
    ];

    for (const group of defaultGroups) {
      this.fieldGroups.push(this.fb.group(group));
    }
  }

  clearDynamicFields(): void {
    this.fieldGroups.clear();
  }

  removeFieldGroup(index: number): void {
    this.fieldGroups.removeAt(index);
  }

  onClear(): void {
    this.form.reset({
      crewSelection: {
        crewId: null,
        selectedProjects: [],
        selectedModules: []
      },
      fileType: '',
      sourceBranch: '',
      featureBranch: '',
      jiraId: '',
      checkOutPath: '',
      commitMessage: '',
      createPr: false
    });

    this.fieldGroups.clear();
    this.addFieldGroup();

    this.successMessage = '';
    this.errorMessage = '';
  }
}
