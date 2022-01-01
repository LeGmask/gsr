export default class GoogleConnector {
	static __instance: GoogleConnector | null = null;

	onAuthStateChangedHandler: any;
	user: any;

	constructor() {
		this.onAuthStateChangedHandler = [];
        this.user = null;
	}
	

	/**
     * @returns {GoogleConnector}
     */
    static getInstance(){
        if (GoogleConnector.__instance == null) {
            GoogleConnector.__instance = new GoogleConnector();
        }

        return this.__instance;
    }

	getUserName() {
        if (this.user !== null) {
            return this.user.getBasicProfile().getName();
        } else {
            return null;
        }
    }

    getUserPhotoURL() {
        if (this.user !== null) {
            return this.user.getBasicProfile().getImageUrl();
        } else {
            return null;
        }
    }

	onAuthStateChanged(changed_func: any) {
        this.onAuthStateChangedHandler.push(changed_func);
    }

    removeAuthStateChanged(changed_func: any) {
        this.onAuthStateChangedHandler = this.onAuthStateChangedHandler.filter((element: any) => element !== changed_func);
    }

	isLogged() {
        return this.user !== null;
    }

	/*
	 * Propagate modification to other components
	*/
	onUpdate() {
		for(var i in this.onAuthStateChangedHandler) {
			this.onAuthStateChangedHandler[i]();
		}
	}

	updateUser(googleUser: any) {
		console.log("accesstoken:",googleUser.getAuthResponse(true).access_token)
		localStorage.setItem('accessToken', googleUser.getAuthResponse(true).access_token);
		this.user = googleUser
		this.onUpdate()
	}

	onLogout() {
		this.user = null
		this.onUpdate()
	}
}
