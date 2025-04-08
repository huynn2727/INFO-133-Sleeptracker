import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonItem,
  IonFab,
  IonFabButton,
  IonIcon,
  IonCard,
  IonCardContent
} from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonList,
    IonItem,
    IonFab,
    IonFabButton,
    IonCard,
    IonCardContent
  ],
})
export class HomePage implements OnInit {
  selectedSegment: string = 'overnight';

  constructor(
    public sleepService: SleepService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log('Overnight data:', this.allOvernightData);
    console.log('Sleepiness data:', this.allSleepinessData);

    this.route.queryParamMap.subscribe(params => {
      const segment = params.get('segment');
      if (segment) {
        this.selectedSegment = segment;
      }
    });
  }

  get allOvernightData() {
    return SleepService.AllOvernightData;
  }
  
  get allSleepinessData() {
    return SleepService.AllSleepinessData;
  }

  segmentChanged(ev: any) {
    console.log('Segment changed:', ev.detail.value);
    this.selectedSegment = ev.detail.value;
  }

  openAddMenu() {
    if (this.selectedSegment === 'overnight') {
      this.router.navigateByUrl('/add-overnight');
    } else {
      this.router.navigateByUrl('/add-sleepiness');
    }
  }

  getSleepStart(entry: any): Date {
    return entry.sleepStart; 
  }
  getSleepEnd(entry: any): Date {
    return entry.sleepEnd;
  }

  getLoggedAt(entry: any): Date {
    return entry.loggedAt;
  }
  getLoggedValue(entry: any): number {
    return entry.loggedValue;
  }

  get totalSleepHoursThisWeek(): number {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
    let totalHours = 0;
    for (const entry of this.allOvernightData) {
      const start = this.getSleepStart(entry);
      const end = this.getSleepEnd(entry);
      if (start >= oneWeekAgo) {
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        totalHours += hours;
      }
    }
    return totalHours;
  }
  
  get averageSleepHoursThisWeek(): number {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
    const recentLogs = this.allOvernightData.filter(e => this.getSleepStart(e) >= oneWeekAgo);
    if (recentLogs.length === 0) return 0;
  
    return this.totalSleepHoursThisWeek / recentLogs.length;
  }


  get sleepinessLogsLast7Days() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return this.allSleepinessData.filter(e => this.getLoggedAt(e) >= oneWeekAgo);
  }

  get averageSleepinessLast7Days(): number {
    const logs = this.sleepinessLogsLast7Days;
    if (logs.length === 0) return 0;
    const total = logs.reduce((acc, curr) => acc + this.getLoggedValue(curr), 0);
    return total / logs.length;
  }
}
