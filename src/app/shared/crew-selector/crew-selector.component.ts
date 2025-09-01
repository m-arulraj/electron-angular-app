import {
  Component,
  Input,
  forwardRef
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { Crew } from '../../crew.service';

export interface CrewSelectionValue {
  crewId: number | null;
  selectedProjects: string[];
  selectedModules: string[];
}

@Component({
  selector: 'app-crew-selector',
  templateUrl: './crew-selector.component.html',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CrewSelectorComponent),
      multi: true
    }
  ]
})
export class CrewSelectorComponent implements ControlValueAccessor {
  @Input() crews: Crew[] = [];

  value: CrewSelectionValue = {
    crewId: null,
    selectedProjects: [],
    selectedModules: []
  };

  onChange: any = () => {};
  onTouched: any = () => {};

  // CVA required methods
  writeValue(value: CrewSelectionValue): void {
    if (value) {
      this.value = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Optional: Implement if you need to disable component
  }

  get selectedCrew(): Crew | undefined {
    return this.crews.find(c => c.id === +this.value.crewId!);
  }

  updateValue() {
    this.onChange({ ...this.value });
    this.onTouched();
  }

  onCrewChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.value.crewId = +select.value;
    this.value.selectedProjects = [];
    this.value.selectedModules = [];
    this.updateValue();
  }

  onProjectChange(projectName: string, modules: string[], event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const { selectedProjects, selectedModules } = this.value;

    if (checked) {
      if (!selectedProjects.includes(projectName)) {
        selectedProjects.push(projectName);
      }
      for (const mod of modules) {
        if (!selectedModules.includes(mod)) {
          selectedModules.push(mod);
        }
      }
    } else {
      this.value.selectedProjects = selectedProjects.filter(p => p !== projectName);
      this.value.selectedModules = selectedModules.filter(m => !modules.includes(m));
    }

    this.updateValue();
  }

  onModuleChange(module: string, projectName: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const { selectedModules, selectedProjects } = this.value;

    if (checked) {
      if (!selectedModules.includes(module)) {
        selectedModules.push(module);
      }
    } else {
      const index = selectedModules.indexOf(module);
      if (index > -1) {
        selectedModules.splice(index, 1);
      }
    }

    const project = this.selectedCrew?.projects.find(p => p.name === projectName);
    const anySelected = project?.modules.some(m => selectedModules.includes(m));

    if (anySelected && !selectedProjects.includes(projectName)) {
      selectedProjects.push(projectName);
    } else if (!anySelected && selectedProjects.includes(projectName)) {
      this.value.selectedProjects = selectedProjects.filter(p => p !== projectName);
    }

    this.updateValue();
  }

  isProjectSelected(projectName: string): boolean {
    const project = this.selectedCrew?.projects.find(p => p.name === projectName);
    return !!project?.modules.some(m => this.value.selectedModules.includes(m));
  }

  isModuleSelected(module: string): boolean {
    return this.value.selectedModules.includes(module);
  }
}
