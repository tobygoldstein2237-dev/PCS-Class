/* global $*/

const contactsTable = $('#contactsTable tbody');
const addContactForm = $('#addContact');
const firstInput = $('#first');
const lastInput = $('#last');
const emailInput = $('#email');
const phoneInput = $('#phone');
const addContactButton = $('#add');

let contacts = [];

function hideAddContactForm() {
    addContactForm.hide();
    addContactForm.trigger('reset');
    addContactButton.show();
}

// This function adds a contact to the table
function addContact(contact) {
    if (!contacts.length) {
        contactsTable.empty();
    }

    contacts.push(contact);

    const row = $('<tr>');

    row.append($('<td>').text(contact.first));
    row.append($('<td>').text(contact.last));
    row.append($('<td>').text(contact.email));
    row.append($('<td>').text(contact.phone));

    const deleteButton = $('<button>').text('delete');
    row.append($('<td>').append(deleteButton));

    contactsTable.append(row);

    deleteButton.click(() => {
        row.remove();

        contacts = contacts.filter(c => c !== contact);

        if (!contacts.length) {
            contactsTable.html(`
        <tr>
          <td colspan="5">no contacts loaded</td>
        </tr>
      `);
        }
    });
}

// Load existing contacts from the JSON file using AJAX
$.getJSON('contacts.json')
    .done(data => {
        data.forEach(contact => {
            addContact(contact);
        });
    })
    .fail(() => {
        console.log('Could not load contacts');
    });

// Add a new contact using the form
addContactForm.on('submit', e => {
    e.preventDefault();

    const newContact = {
        first: firstInput.val(),
        last: lastInput.val(),
        email: emailInput.val(),
        phone: phoneInput.val()
    };

    addContact(newContact);

    hideAddContactForm();
});

addContactButton.click(() => {
    addContactForm.show();
    addContactButton.hide();
});

$('#cancel').click(hideAddContactForm);