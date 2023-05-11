import { Listener, createObserver } from "./observer";

interface BeforeSetEvent<T> {
  value: T;
  newValue: T;
}

interface AfterSetEvent<T> {
	value: T;
}

interface BaseRecord {
	id: string | number;
}


interface Database<T extends BaseRecord> {
	set(newValue: T): void;
	update(id: string | number, newValue: Partial<Omit<T, "id">>): void;
	get(id: string | number): T | undefined;

	onBeforeAdd(listener: Listener<BeforeSetEvent<T>>): () => void;
	onAfterAdd(listener: Listener<AfterSetEvent<T>>): () => void;

	visit(visitor: (item: T) => void): void;
	selectBest(scoreStrategy: (item: T) => number): T | undefined;
}

// Factory pattern
export function createDatabase<T extends BaseRecord>() {
	class InMemoryDatabase implements Database<T> {
		private db: Record<string, T> = {};

		static instance: InMemoryDatabase = new InMemoryDatabase();

		private beforeAddListeners = createObserver<BeforeSetEvent<T>>();
		private afterAddListeners = createObserver<AfterSetEvent<T>>();

		private constructor() {}

		public set(newValue: T): void {
			this.beforeAddListeners.publish({
				newValue,
				value: this.db[newValue.id],
			});

			this.db[newValue.id] = newValue;

			this.afterAddListeners.publish({
				value: newValue,
			});
		}

		public get(id: string | number): T | undefined {
			return this.db[id];
		}

		update(id: string | number, newValue: Partial<Omit<T, "id">>): void {
			const oldValue = this.db[id];
			if (oldValue) {
				this.set({
					...oldValue,
					...newValue
				});
			}
		}

		onBeforeAdd(listener: Listener<BeforeSetEvent<T>>): () => void {
			return this.beforeAddListeners.subscribe(listener);
		}
		onAfterAdd(listener: Listener<AfterSetEvent<T>>): () => void {
			return this.afterAddListeners.subscribe(listener);
		}

		// Vistor
		visit(visitor: (item: T) => void): void {
			Object.values(this.db).forEach(visitor);
		}

		// Strategy
		selectBest(scoreStrategy: (item: T) => number): T | undefined {
			const found: {
				max: number;
				item: T | undefined;
			} = {
				max: 0,
				item: undefined,
			};

			Object.values(this.db).reduce((f, item) => {
				const score = scoreStrategy(item);
				if (score >= f.max) {
					f.max = score;
					f.item = item;
				}
				return f;
			}, found);

			return found.item;
		}
	}

	// Singleton pattern
	// const db = new InMemoryDatabase();
	// return db;
	return InMemoryDatabase;
}