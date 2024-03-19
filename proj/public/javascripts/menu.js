function redir_page(fname) {
    console.log('go to /' + fname);
    window.location.href ='/' + fname;
}

function page_open(pageName) {
    return valid_pages.includes(pageName);
}
/**
 * The layout here is like (tab order may be different)
 * ------------------------------------------
 *              Block                       |
 *      that contains message               |
 * --------------------------------------   |    <- Menu
 * Main | Account | Contributors | Start    |
 * --------------------------------------   |---------------------------------------------------
 *                                          |
 *                                          |
 *              Central                     |   <- WebSite Contents
 *                                          |
 *              Layout                      |
 *                                          |       
 *                                          |  
 *                                          |  
 * ------------------------------------------
 * 
 * In menu.js, menu.ejs, menu.css we deal with menu area
 */

function menu_click(menuItemName, elmnt, color) {
    // var i, tabcontent, tablinks, loginmesg;
    // // make old blocks go away
    // tabcontent = document.getElementsByClassName("tabcontent");
    // for (i = 0; i < tabcontent.length; i++) { // makes all the menu blocks disappear
    //     tabcontent[i].style.display = "none";
    // }
    // console.log(menuItemName);
    // document.getElementById(menuItemName).style.display = "block"; // make the displayed blocks appear
    // // In account block we have two message, here we need to select one to display
    // // Here we only display the first kind of message 
    // // TODO : needs to check condition and diplay the other message
    // if (menuItemName === 'Account') {
    //     loginmesg = document.querySelectorAll(".menu-login-message");
    //     loginmesg[1].style.display = "none";
    // }

    if (page_open(menuItemName)) redir_page(menuItemName.toLowerCase());
}
// Get the element with id="defaultOpen" and click on it
// document.getElementById("main-button").click();

