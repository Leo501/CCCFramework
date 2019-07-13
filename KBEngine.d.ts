declare module KBEngine {
	class Class {
		static extend(props): string
	}

	class Account {

	}

	class Entity extends Class {
		static extend(arg0: { __init__: () => void; onDisableAccountRes(msg: any): void; onDisableLoginRes(data: any): void; onRefreshTokenRes(token: any): void; }): typeof Account {
			throw new Error("Method not implemented.");
		}
	}

	const app: any

	function create(params: type) {

	}

	class Event {
		static register(arg0: string, arg1: this, arg2: string) {
			throw new Error("Method not implemented.");
		}
		static deregister(arg0: string, arg1: this, arg2: string) {
			throw new Error("Method not implemented.");
		}
		static fire(arg0: string, userName: any, pw: any, datas: {}) {
			throw new Error("Method not implemented.");
		}
	}

	function INFO_MSG(params: type) {

	}

	function DEBUG_MSG(params: type) {

	}

	function ERROR_MSG(params: type) {

	}

	function WARNING_MSG(params: type) {

	}

}
