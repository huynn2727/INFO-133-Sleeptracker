import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

@Injectable({
  providedIn: 'root'
})
export class SleepService {
  private static LoadDefaultData: boolean = true;
  public static AllSleepData: SleepData[] = [];
  public static AllOvernightData: OvernightSleepData[] = [];
  public static AllSleepinessData: StanfordSleepinessData[] = [];

  private storageInitialized = false;

  constructor(private storage: Storage) {
    this.initStorage();
  }

  private async initStorage() {
    await this.storage.create();
    this.storageInitialized = true;
    await this.loadData();

    // Only add default data if no stored logs exist and if we haven't already loaded them.
    if (SleepService.LoadDefaultData && SleepService.AllSleepData.length === 0) {
      this.addDefaultData();
      SleepService.LoadDefaultData = false;
    }
  }

  private async loadData() {
    // Load overnight logs
    const storedOvernight = await this.storage.get('overnightLogs');
    if (storedOvernight) {
      // Rebuild each object as an instance of OvernightSleepData.
      SleepService.AllOvernightData = storedOvernight.map((obj: any) => {
        return new OvernightSleepData(new Date(obj.sleepStart), new Date(obj.sleepEnd));
      });
    }
    // Load sleepiness logs
    const storedSleepiness = await this.storage.get('sleepinessLogs');
    if (storedSleepiness) {
      SleepService.AllSleepinessData = storedSleepiness.map((obj: any) => {
        return new StanfordSleepinessData(obj.loggedValue, new Date(obj.loggedAt));
      });
    }
    // Combine all logs
    SleepService.AllSleepData = [
      ...SleepService.AllOvernightData,
      ...SleepService.AllSleepinessData
    ];
  }

  private async saveOvernightData() {
    // Convert instances to plain objects for storage.
    const data = SleepService.AllOvernightData.map(d => ({
      sleepStart: d['sleepStart'], // Access private property at runtime
      sleepEnd: d['sleepEnd']
    }));
    await this.storage.set('overnightLogs', data);
  }

  private async saveSleepinessData() {
    const data = SleepService.AllSleepinessData.map(d => ({
      loggedValue: d['loggedValue'],
      loggedAt: d['loggedAt']
    }));
    await this.storage.set('sleepinessLogs', data);
  }

  private addDefaultData() {
    // Default overnight log: yesterday 1:03am to 9:03am
    let goToBed = new Date();
    goToBed.setDate(goToBed.getDate() - 1);
    goToBed.setHours(1, 3, 0);
    let wakeUp = new Date();
    wakeUp.setTime(goToBed.getTime() + 8 * 60 * 60 * 1000);
    this.logOvernightData(new OvernightSleepData(goToBed, wakeUp));

    // Default sleepiness log: yesterday at 2:38pm, rating 4
    let sleepinessDate = new Date();
    sleepinessDate.setDate(sleepinessDate.getDate() - 1);
    sleepinessDate.setHours(14, 38, 0);
    this.logSleepinessData(new StanfordSleepinessData(4, sleepinessDate));

    // Another overnight log: yesterday 11:11pm to 8:11am (9 hours sleep)
    goToBed = new Date();
    goToBed.setDate(goToBed.getDate() - 1);
    goToBed.setHours(23, 11, 0);
    wakeUp = new Date();
    wakeUp.setTime(goToBed.getTime() + 9 * 60 * 60 * 1000);
    this.logOvernightData(new OvernightSleepData(goToBed, wakeUp));
  }

  public async logOvernightData(sleepData: OvernightSleepData) {
    SleepService.AllSleepData.push(sleepData);
    SleepService.AllOvernightData.push(sleepData);
    if (this.storageInitialized) {
      await this.saveOvernightData();
    }
  }

  public async logSleepinessData(sleepData: StanfordSleepinessData) {
    SleepService.AllSleepData.push(sleepData);
    SleepService.AllSleepinessData.push(sleepData);
    if (this.storageInitialized) {
      await this.saveSleepinessData();
    }
  }
}
