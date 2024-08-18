document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const noteTitleInput = document.getElementById('noteTitle');
    const noteContentTextarea = document.getElementById('noteContent');
    const saveNoteBtn = document.getElementById('saveNoteBtn');
    const newNoteBtn = document.getElementById('newNoteBtn');
    const openNoteBtn = document.getElementById('openNoteBtn');
    const notesModal = document.getElementById('notesModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const notesList = document.getElementById('notesList');
    const mainContent = document.getElementById('mainContent');

    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    let currentNoteIndex = null; // Track the currently opened note index
    let originalNote = {}; // Track the original note's title and content

    // Render the list of notes in the modal
    function renderNotesList() {
        notesList.innerHTML = ''; // Clear the existing list
        notes.forEach((note, index) => {
            const noteItem = document.createElement('div');
            noteItem.classList.add('flex', 'justify-between', 'items-center', 'bg-gray-600', 'p-2', 'rounded-lg');
            noteItem.innerHTML = `
                <span class="ml-2">${note.title}</span>
                <div>
                    <button class="px-2 py-1 bg-red-500 rounded-lg hover:bg-red-600 mr-2 delete-btn" data-index="${index}">
                        <img class="w-6 h-6" src="./assets/delete.png" alt="Delete">
                    </button>
                </div>
            `;
            noteItem.addEventListener('click', () => openNote(index));
            notesList.appendChild(noteItem);
        });

        // Attach event listeners to delete buttons
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent the click event from bubbling up to the noteItem
                deleteNote(button.getAttribute('data-index'));
            });
        });
    }

    // Function to show feedback animation
    function showFeedback(success = true) {
        const originalIcon = './assets/save.png';
        const feedbackIcon = success ? './assets/success.png' : './assets/error.png';

        // Change the icon to feedback icon
        saveNoteBtn.querySelector('img').src = feedbackIcon;

        // Revert to original icon after a delay
        setTimeout(() => {
            saveNoteBtn.querySelector('img').src = originalIcon;
        }, 1000); // 1.0 seconds delay
    }

    // Save the current note
    function saveNote() {
        const title = noteTitleInput.value.trim();
        const content = noteContentTextarea.value.trim();

        if (!title || !content) {
            showFeedback(false); // Show error animation
            return;
        }

        if (currentNoteIndex !== null) {
            // Check if there are changes
            if (title === originalNote.title && content === originalNote.content) {
                showFeedback(true); // Show success animation
                return;
            }

            // Update the existing note
            notes[currentNoteIndex] = { title, content };
        } else {
            // Add the new note to the top
            notes.unshift({ title, content });
        }

        localStorage.setItem('notes', JSON.stringify(notes));
        showFeedback(true); // Show success animation
        renderNotesList();

        // Reset state after saving
        currentNoteIndex = null;
        originalNote = {};
    }

    // Open the modal to display saved notes
    function openNoteList() {
        mainContent.classList.add('blurred-bg'); // Blur the main content
        notesModal.classList.remove('hidden'); // Show the modal
        renderNotesList();
    }

    // Close the notes modal
    function closeModal() {
        mainContent.classList.remove('blurred-bg'); // Remove blur effect
        notesModal.classList.add('hidden'); // Hide the modal
    }

    // Open a selected note from the list
    function openNote(index) {
        const note = notes[index];
        noteTitleInput.value = note.title;
        noteContentTextarea.value = note.content;
        currentNoteIndex = index; // Track the index of the opened note
        originalNote = { ...note }; // Save the original note's title and content
        closeModal();
    }

    // Delete a note by index
    function deleteNote(index) {
        notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(notes));
        renderNotesList();
    }

    // Create a new note by clearing the input fields
    function createNewNote() {
        noteTitleInput.value = '';
        noteContentTextarea.value = '';
        currentNoteIndex = null; // Reset the current note index when creating a new note
        originalNote = {}; // Reset the original note
    }

    // Event listeners for buttons
    saveNoteBtn.addEventListener('click', () => {
        saveNoteBtn.disabled = true; // Temporarily disable the save button
        saveNote();
        setTimeout(() => {
            saveNoteBtn.disabled = false; // Re-enable the save button after a short delay
        }, 500);
    });
    newNoteBtn.addEventListener('click', createNewNote);
    openNoteBtn.addEventListener('click', openNoteList);
    closeModalBtn.addEventListener('click', closeModal);

    // Render the notes list when the page loads
    renderNotesList();
});
