export interface IDictionary {
	get<T>(key: string, defaultValue: T): T;
	set<T>(key: string, value: T): IDictionary;
}
