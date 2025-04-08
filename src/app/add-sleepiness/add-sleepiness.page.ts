import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { SleepService } from '../services/sleep.service';

@Component({
  selector: 'app-add-sleepiness',
  templateUrl: './add-sleepiness.page.html',
  styleUrls: ['./add-sleepiness.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class AddSleepinessPage {
  loggedValue: number = 1;
  loggedAt: string = new Date().toISOString();
  sleepinessScaleLevels: string[] = [];
  showPicker = false; 
  maxDate: string = new Date().toISOString();

  constructor(
    private sleepService: SleepService,
    private router: Router
  ) {
    this.loadSleepinessScaleLevels();
  }

  loadSleepinessScaleLevels() {
    this.sleepinessScaleLevels = StanfordSleepinessData.ScaleValues
      .filter((value: string | undefined): value is string => typeof value === 'string');
  }

  onDateTimeChange(event: any) {
    this.loggedAt = event.detail.value;
  }

  save() {
    const newSleepinessData = new StanfordSleepinessData(this.loggedValue, new Date(this.loggedAt));
    this.sleepService.logSleepinessData(newSleepinessData);
    this.router.navigate(['/home'], { queryParams: { segment: 'sleepiness' } });
  }

  cancel() {
    this.router.navigateByUrl('/home');
  }
}
