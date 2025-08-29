import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormArray
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CrewService, Crew, CrewProjectSelectionModel, SelectedProject } from '../crew.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-crew-project-selector',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
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
      crew: [''],
      selectedProjects: this.fb.control<string[]>([]),
      selectedModules: this.fb.control<string[]>([]),
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
        this.clearDynamicFields(); // Optional: Clear when other types are selected
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

  selectedCrew(): Crew | undefined {
    const crewId = +this.form.get('crew')?.value;
    return this.crews.find(c => c.id === crewId);
  }

  onCrewChange() {
    this.form.get('selectedProjects')?.setValue([]);
    this.form.get('selectedModules')?.setValue([]);
  }

  onProjectToggle(projectName: string, modules: string[], checked: boolean): void {
    console.log('Project toggle:', projectName, checked);
    const selectedProjects = this.form.get('selectedProjects')?.value || [];
    const selectedModules = this.form.get('selectedModules')?.value || [];

    if (checked) {
      if (!selectedProjects.includes(projectName)) {
        selectedProjects.push(projectName);
      }
      for (const module of modules) {
        if (!selectedModules.includes(module)) {
          selectedModules.push(module);
        }
      }
    } else {
      const projIndex = selectedProjects.indexOf(projectName);
      if (projIndex !== -1) {
        selectedProjects.splice(projIndex, 1);
      }
      for (const module of modules) {
        const modIndex = selectedModules.indexOf(module);
        if (modIndex !== -1) {
          selectedModules.splice(modIndex, 1);
        }
      }
    }

    this.form.get('selectedProjects')?.setValue([...selectedProjects]);
    this.form.get('selectedModules')?.setValue([...selectedModules]);
  }


  onModuleToggle(module: string, projectName: string, checked: boolean): void {
    console.log('Module toggle:', module, checked);
    console.log('Project for module:', projectName);

    const selectedModules = this.form.get('selectedModules')?.value || [];
    const selectedProjects = this.form.get('selectedProjects')?.value || [];

    // Add or remove the module
    if (checked) {
      if (!selectedModules.includes(module)) {
        selectedModules.push(module);
      }
    } else {
      const index = selectedModules.indexOf(module);
      if (index !== -1) {
        selectedModules.splice(index, 1);
      }
    }

    const project = this.selectedCrew()?.projects.find(p => p.name === projectName);
    console.log('Project found:', project);

    const someModulesSelected = project?.modules.some(m => selectedModules.includes(m));

    console.log('All modules selected:', someModulesSelected);

    const projIndex = selectedProjects.indexOf(projectName);

    if (someModulesSelected && projIndex === -1) {
      selectedProjects.push(projectName);
      console.log('Project added:', projectName);
    } else if (!someModulesSelected && projIndex !== -1) {
      selectedProjects.splice(projIndex, 1);
      console.log('Project removed:', projectName);
    }

    this.form.get('selectedModules')?.setValue([...selectedModules]);
    this.form.get('selectedProjects')?.setValue([...selectedProjects]);

    console.log('Selected Modules:', selectedModules);
    console.log('Selected Projects:', selectedProjects);
  }



  isProjectSelected(projectName: string): boolean {
    const selectedModules = this.form.get('selectedModules')?.value || [];
    const project = this.selectedCrew()?.projects.find(p => p.name === projectName);
    if (!project) return false;
    // Return true if **any** module from the project is selected
    return project.modules.some(module => selectedModules.includes(module));
  }


  isModuleSelected(module: string): boolean {
    return this.form.get('selectedModules')?.value.includes(module);
  }

  get groupedSelectedProjects(): SelectedProject[] {
    const selectedModules: string[] = this.form.get('selectedModules')?.value || [];
    const selectedProjects: string[] = this.form.get('selectedProjects')?.value || [];

    const result: SelectedProject[] = [];
    const crew = this.selectedCrew();
    if (!crew) return result;

    for (const project of crew.projects) {
      if (selectedProjects.includes(project.name)) {
        const modules = project.modules.filter(m => selectedModules.includes(m));
        result.push({ projectName: project.name, modules });
      }
    }
    return result;
  }

  onSubmit() {
    if (!this.form.valid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }
    console.log('Selected Projects (raw from form control):', this.form.get('selectedProjects')?.value);
    console.log('Grouped Selected Projects:', this.groupedSelectedProjects);

    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;

    const formValue = this.form.value;
    console.log('Form Data JSON:', JSON.stringify(formValue, null, 2));
    const model: CrewProjectSelectionModel = {
      crewId: formValue.crew ? +formValue.crew : null,
      selectedProjects: this.groupedSelectedProjects,
      fileType: formValue.fileType,
      fieldGroups: formValue.fieldGroups,
      sourceBranch: formValue.sourceBranch,
      featureBranch: formValue.featureBranch,
      checkOutPath: formValue.checkOutPath,
      jiraId: formValue.jiraId,
      commitMessage: formValue.commitMessage,
      createPr: formValue.createPr
    };
    console.log('CrewProjectSelectionModel Data JSON:', JSON.stringify(model, null, 2));
    /*this.crewService.submitCrewSelection(model)
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
      });*/
  }

  removeFieldGroup(index: number): void {
    this.fieldGroups.removeAt(index);
  }
  setDefaultFieldsForJF(): void {
    this.clearDynamicFields();

    const defaultGroups = [
      { field1: 'PR_BR', field2: '=', field3: '1', field4: 'rele/t' },
      { field1: 'TR_BR', field2: '=', field3: '1', field4: 'stage-test' }
    ];

    for (const group of defaultGroups) {
      this.fieldGroups.push(this.fb.group({
        field1: [group.field1],
        field2: [group.field2],
        field3: [group.field3],
        field4: [group.field4]
      }));
    }
  }

  clearDynamicFields(): void {
    this.fieldGroups.clear();
  }

onClear(): void {
  // Reset the whole form, optionally set createPr false or default values as needed
  this.form.reset({
    crew: '',
    selectedProjects: [],
    selectedModules: [],
    sourceBranch: '',
    featureBranch: '',
    jiraId: '',
    commitMessage: '',
    createPr: false
  });

  // Clear dynamic fieldGroups and add the initial one
  this.fieldGroups.clear();
  this.addFieldGroup();

  // Clear any success or error messages
  this.successMessage = '';
  this.errorMessage = '';
}

}
