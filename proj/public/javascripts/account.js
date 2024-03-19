let COMMUNICATION = 'http://34.16.138.110:8443/';
let LOGIN_API = '/account/login';
let REGSTER_API = '/account/register';
let UPDATE_API = '/account/updatePassword'
let DASHBOARD_API = '/dashboard';
let TRY_DASHBOARD_API = '/account/trydashboard';
/** 
 * A series of functions to handle error during registration and login
*/
function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add(`form__message--${type}`);
}

function setInputError(inputElement, message) {
    inputElement.classList.add("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
}

function clearInputError(inputElement) {
    inputElement.classList.remove("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
}

// Function to access protected resource
// make an attempt to access dash board.
function dashboard() {
    const token = localStorage.getItem('token'); // Get the token from localStorage
    if(token === null) {
        return ;
    }
    const headers = { Authorization: `Bearer ${token}` };
    axios.get(TRY_DASHBOARD_API, { headers }).then((response) => {
        if (response.data.success) {
            window.location = DASHBOARD_API ;
            // the following code will not work because we are still in current page.
            // This kinds of make sense because we can't force (or can we) the brower to attach our token to every request it sends.
            // axios.get(DASHBOARD_API, { headers }).then((response) => {
            //     if (response.data.success) {
            //         console.log('logged in');
            //     }
            // }).catch((error) => {
            //     console.error(error);
            // });
            // ok, now we are at dashboard
        } else {
            console.log('attempt for dashboard failed');
            // remain in current page 
            // alert(response.data.message);
            // window.location.href = '/login';
        }
    }).catch((error) => {
        console.error(error);
    });
}

/**
 * submit the login information including username/email and password
 */
function submit_login_info(){
    var username=document.querySelector("#form__input--loginusr").value;
    var password=document.querySelector("#form__input--loginpassword").value;
    console.log(username);
    console.log(password);
    console.log("Test1"); 
    if(password.includes("'") ) {
        return false;
    }
    /**
     * client (call->) server function 
     * js (in) server
     */
    return new Promise(function(resolve, reject) {
        const instance = axios.create({baseURL: COMMUNICATION});
        instance.post(LOGIN_API, {
            username: username,
            password: password
        })
        .then(function (response) {
            if(response.data.success) {
                const token = response.data.token;
                localStorage.setItem('token', token); // Save the token in localStorage
                localStorage.setItem('username', username); // Save the username in localStorage
                dashboard();
                resolve(true); // pointless
            }else{
                resolve(false);
            }
            // var data= response['data'] ;
            // console.log(data);
            // if(data==="Success"){
            //     resolve(true);
            // }
            // else{
            //     resolve(false);
            // }
        })
        .catch(function (error) {
            console.log(error);
        });
    });

}
/**
 * submit the registration related information 
 */
function submit_regstration_info(){
    var username=document.querySelector("#signupUsername").value;
    var email=document.querySelector("#form__input--signupemail").value;
    var password=document.querySelector("#form__input--signuppassword").value;
    var confirmed_password=document.querySelector("#form__input--confirmedpassword").value;
    console.log(password);
    console.log(confirmed_password);
    if (password!==confirmed_password){
        return false; 
    }
    return new Promise(function(resolve, reject) {
        const instance = axios.create({baseURL: COMMUNICATION});
        instance.post(REGSTER_API, {
            username: username,
            password: password,
            email : email
        })
        .then(function (response) {
            var data= response['data'] ;
            console.log(data);
            if(data==="Success"){
                resolve(true);
            }
            else{
                resolve(false);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    });


    return true;
}


/**
 * update the password for a user 
 */
function update_password(){
    var username=document.querySelector("#signupUsername2").value;
    var original_password=document.querySelector("#form__input--originalPassword").value;
    var new_password=document.querySelector("#form__input--newPassword").value;
    var new_confirmed_password=document.querySelector("#form__input--newconfirmedpassword").value;
    
    console.log(username);
    console.log(original_password);
    console.log(new_password);
    console.log(new_confirmed_password);
    
    
    if(original_password.includes("'") || 
        new_password.includes("'") ||
        new_password == original_password || 
        new_password != new_confirmed_password ) {
        return false;
    }

    return new Promise(function(resolve, reject) {
        const instance = axios.create({baseURL: COMMUNICATION});
        instance.post(UPDATE_API, {
            username: username,
            original_password: original_password,
            new_password : new_password
        })
        .then(function (response) {
            if(response.data.success) {
                const token = response.data.token;
                localStorage.setItem('token', token); // Save the token in localStorage
                localStorage.setItem('username', username); // Save the username in localStorage
                dashboard();
                resolve(true); // pointless
            }else{
                resolve(false);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    });

}


/**
 * Function called when html file is loaded.
 * It contains logics to 
 * 1. swap form--hidden class to two divisions. form--hidden change the display property.
 * 2. handle the submit request by overwritting submit event for the form.
 * 3. handle the username registration limits, and initialize the input box.
 */
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login"); // login form object
    const createAccountForm = document.querySelector("#createAccount"); // registration form object
    const changePasswordForm = document.querySelector("#changePassWord"); // change password form (interface)
    const loginMeta = document.querySelectorAll(".login-region");
    let isFormLogin=true;
    /**
     * 0. Check local storage : If we have token, we directly jump to dashboard
    */
    dashboard();

    /**
     * 1. add events for swapping form--hidden class to two divisions. form--hidden change the display property.
     */
    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault();
        createAccountForm.classList.remove("form--hidden");
        loginForm.classList.add("form--hidden");
        isFormLogin=false;
    });

    document.querySelector("#linkLogin1").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.remove("form--hidden");
        if(!createAccountForm.classList.contains("form--hidden")) 
            createAccountForm.classList.add("form--hidden");
        
        isFormLogin=true;
    });
    document.querySelector("#linkLogin2").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.remove("form--hidden");
        if(!changePasswordForm.classList.contains("form--hidden"))
                changePasswordForm.classList.add("form--hidden");
        
        isFormLogin=true;
    });

    document.querySelector("#linkeChangePassword").addEventListener("click", e => {
        e.preventDefault();
        changePasswordForm.classList.remove("form--hidden");
        loginForm.classList.add("form--hidden"); // change password must comes from login
        
        isFormLogin=false;
    }
    
    );
    /**
     * 2. handle the submit request by overwritting submit event for the form.
     */

    changePasswordForm.addEventListener("submit", e => {
            e.preventDefault();
            console.log("change password");
            update_password().then(function(result) {

                if(!result) {
                    setFormMessage(loginForm, "error", "username has been registered");
                }
                else{
                    loginForm.classList.remove("form--hidden");
                    changePasswordForm.classList.add("form--hidden");
                    isFormLogin=true;
                }
            }).catch(function(error) {
                console.log(error);
            }); 
        });

    loginForm.addEventListener("submit", e => {
        e.preventDefault();
        // Perform your AJAX/Fetch login

        submit_login_info().then(function(result) {
            if(!result) {
                setFormMessage(loginForm, "error", "Invalid username/password combination");
            }
            else{
                loginForm.classList.add("form--hidden");
                for(var i=0;i<loginMeta.length;i++){
                    loginMeta[i].classList.remove("div__hidden");
                }
            }
        }).catch(function(error) {
            console.log(error);
        }); 

    });
    createAccountForm.addEventListener("submit", e => {
        e.preventDefault();
        // Perform your AJAX/Fetch login

        submit_regstration_info().then(function(result) {

            if(!result) {
                setFormMessage(loginForm, "error", "username has been registered");
            }
            else{
                loginForm.classList.remove("form--hidden");
                createAccountForm.classList.add("form--hidden");
                isFormLogin=true;
            }
        }).catch(function(error) {
            console.log(error);
        }); 
    });
    /**
     *  3. handle the username registration limits, and initialize the input box.
     */
    document.querySelectorAll(".form__input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            if (e.target.id === "signupUsername" && e.target.value.length > 0 && e.target.value.length < 10) {
                setInputError(inputElement, "Username must be at least 10 characters in length");
            }
        });

        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
    });

    
});
