import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { SleepService } from '../services/sleep.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';

@Component({
  selector: 'app-add-overnight',
  templateUrl: './add-overnight.page.html',
  styleUrls: ['./add-overnight.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class AddOvernightPage {
  bedTime: Date;
  wakeTime: Date;
  showPicker = false;
  pickerMode: 'date' | 'time' = 'date';
  whichField: 'bedTime' | 'wakeTime' = 'bedTime'; 
  tempDate = new Date(); 
  maxDate: string;

  constructor(
    private sleepService: SleepService,
    private router: Router
  ) {
    const now = new Date();
    this.bedTime = now;
    this.wakeTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    this.maxDate = now.toISOString();
  }

  openDatePicker(which: 'bedTime' | 'wakeTime') {
    this.whichField = which;
    this.pickerMode = 'date';
    this.tempDate = new Date(which === 'bedTime' ? this.bedTime : this.wakeTime);
    this.showPicker = true;
  }

  openTimePicker(which: 'bedTime' | 'wakeTime') {
    this.whichField = which;
    this.pickerMode = 'time';
    this.tempDate = new Date(which === 'bedTime' ? this.bedTime : this.wakeTime);
    this.showPicker = true;
  }

  onDateTimeChange(event: any) {
    const isoString = event.detail.value;
    this.tempDate = new Date(isoString);
  }

  confirmPicker() {
    if (this.whichField === 'bedTime') {
      if (this.pickerMode === 'date') {
        this.bedTime = this.mergeDate(this.bedTime, this.tempDate);
      } else {
        this.bedTime = this.mergeTime(this.bedTime, this.tempDate);
      }
    } else {
      if (this.pickerMode === 'date') {
        this.wakeTime = this.mergeDate(this.wakeTime, this.tempDate);
      } else {
        this.wakeTime = this.mergeTime(this.wakeTime, this.tempDate);
      }
    }
    this.closePicker();
  }

  closePicker() {
    this.showPicker = false;
  }

  mergeDate(original: Date, newDate: Date): Date {
    const merged = new Date(original.getTime());
    merged.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
    return merged;
  }

  mergeTime(original: Date, newTime: Date): Date {
    const merged = new Date(original.getTime());
    merged.setHours(newTime.getHours(), newTime.getMinutes(), 0, 0);
    return merged;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  save() {
    const newOvernight = new OvernightSleepData(this.bedTime, this.wakeTime);
    this.sleepService.logOvernightData(newOvernight);
    this.router.navigate(['/home'], { queryParams: { segment: 'overnight' } });
  }

  cancel() {
    this.router.navigateByUrl('/home');
  }
}
