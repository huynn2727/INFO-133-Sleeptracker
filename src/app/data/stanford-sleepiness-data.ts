/* from the Stanford Sleepiness Scale */
/* https://web.stanford.edu/~dement/sss.html */

import { SleepData } from './sleep-data';

export class StanfordSleepinessData extends SleepData {
	public static ScaleValues = [undefined,
	'Feeling active, vital, alert, or wide awake', 
	'Functioning at high levels, but not at peak; able to concentrate', 
	'Awake, but relaxed; responsive but not fully alert', 
	'Somewhat foggy, let down', 
	'Foggy; losing interest in remaining awake; slowed down', 
	'Sleepy, woozy, fighting sleep; prefer to lie down', 
	'No longer fighting sleep, sleep onset soon; having dream-like thoughts']; 

	private loggedValue:number;

	constructor(loggedValue:number, loggedAt:Date = new Date()) {
		super();
		this.loggedValue = loggedValue;
		this.loggedAt = loggedAt;
	}

	override summaryString():string {
		return this.loggedValue + ": " + StanfordSleepinessData.ScaleValues[this.loggedValue];
	}
}
