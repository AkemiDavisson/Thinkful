$(document).ready(function () {

    var itemForm = $("#itemForm");
    var itemSubmitBtn = $("#addItem");
    var itemsList = $("#itemsList");
    var selectBtn = $("#selectItemBtn");
    var completeBtn = $("#completeItemBtn");

    //make list sortable
    itemsList.sortable();

    //add item on button click and keydown enter(submit)
    itemSubmitBtn.on("click", addItem);
    itemForm.submit(addItem);

    //call edit method when edit button clicked
    itemsList.on("click", "a", editItemOn);

    //call edit method when 'dblclick' li element
    itemsList.on("dblclick", "li", editItemOnDblClick);

    //Save edited field if user clicks outside of list or keydown enter
    itemsList.on("focusout", "input[type=text]", editItemOff);
    itemsList.on("keypress", "input[type=text]", function (event) {
        // Save changes when enter key is pressed
        if (event.which == 13) {
            $(this).focusout();
        }
    });

    //select checkbox when clicking li element
    itemsList.on("click", "li", itemClick);

    //select checkbox when click checkbox
    itemsList.on("click", "input[type=checkbox]", itemClick);

    //toggle select or deselect all checkboxes
    selectBtn.click(toggleSelect);

    //handle complete button and remove from list
    completeBtn.click(completeItems);
});


// Adds item to shopping list
function addItem() {
    var item = $('#item');
    var value = item.val().trim(); //.trim used to delete whitespaces
    var error = $('#error').hide();

    if (value === "") {
        console.log('No item added, please add a non blank item');
        error.find("span").text("Please enter a non-empty value");
        error.show();
        return false;
    }
    else {
        var newItem = $(
            "<li>" +
               "<input type=\"checkbox\"/>" +
               "<input type=\"text\" value=\"" + value + "\">" +
                    "<span>" + value + "</span>" +
                    "<a class='edit' href=\"#\">Edit</a> " +
            "</li>");

        newItem.appendTo("#itemsList").hide();
        newItem.slideDown();

        //reset item value
        item.val("");
        
        //update check count & enables select all btn)
        updateCheckCount();

        return false;
    }

};

//checks boxes on click (li and checkbox)
function itemClick(event) {
    $(this).find("input[type=checkbox]").click();

    updateCompletedBtn();
    updateCheckCount();

    // Don't bubble up the event to the enclosing <li> element ?? Ask Willis
    event.stopPropagation();
}

//enables or disables completed button if items are selected
function updateCompletedBtn() {
    var checkedCount = $("#itemsList input[type=checkbox]:checked").length;

    $("#completeItemBtn").prop("disabled", checkedCount === 0);
}

//updates the checked item count, changes 'select all' 'deselect all' text based on number of items
//as well as disables it if no items in list
function updateCheckCount() {
    var checkedCount = $("#itemsList input[type=checkbox]:checked").length;
    var checkBoxCount = $("#itemsList input[type=checkbox]").length;
    var selectBtn = $("#selectItemBtn");

    if (checkedCount == checkBoxCount && checkBoxCount != 0) {
        selectBtn.val("Deselect all");
    }
    else if (checkedCount != checkBoxCount || checkBoxCount == 0) {
        selectBtn.val("Select all");
    }

        selectBtn.prop("disabled", checkBoxCount == 0);
}

//opens editing for item on dblclick
function editItemOnDblClick(event) {
    var input = $(this).find("input[type=text]");
    var span = $(this).find("span");

    span.hide();
    input.show().focus();
}

//opens editing for item on btn click
function editItemOn(event) {
    var input = $(this).parent().find("input[type=text]");
    var span = $(this).parent().find("span");

    span.hide();
    input.show().focus();
}

//closes and saves value of edited item then displays value in 'span'
function editItemOff(event) {
    var input = $(this);
    var span = input.siblings("span");

    input.hide();
    span.text(input.val());
    console.log("Edited value" + input.val());
    span.show();
}

//either selects all or deselects all checkboxes based on btn.val()
//updates the button state and checkedCount
function toggleSelect() {

    var checkboxes = $("#itemsList input[type=checkbox]")

    if ($(this).val() == "Select all") {

         checkboxes.prop("checked", true);
    }
    else if ($(this).val() == "Deselect all") {

        checkboxes.prop("checked", false);
    }

    updateCheckCount();
    updateCompletedBtn();
}

//removes selected items from list
//updates the button state and checkedCount
function completeItems() {

    var checkedItems = $("#itemsList input[type=checkbox]:checked").parent();

    checkedItems.slideUp(function () {
        $(this).remove();
        updateCompletedBtn();
        updateCheckCount();
    });
}

