$(document).ready(function () {
    // Initialize Highlight.js
    hljs.highlightAll();
    

    $("#sendButton").click(function () {

        let prompt = $("#userInput").val().trim();
        if (prompt === "") return;

        // Disable send button
        let sendButton = $("#sendButton");
        sendButton.prop("disabled", true);
        sendButton.text("Generating ⏳ ");
        sendButton.addClass("bg-warning");  // Change to red

        //disable refresh iframe button
        let refresh_button=$('#refresh');
        refresh_button.prop("disabled", true);
        refresh_button.css("background-color", "#ff0000");  // Change to red

        //disable restore code button
        let restore_button=$('#restore');
        restore_button.prop("disabled", true);
        restore_button.css("background-color", "#ff0000");  // Change to red

        //disable copy button
        let copy_button=$('#copyButton');
        copy_button.prop("disabled", true);
        copy_button.css("background-color", "#ff0000");  // Change to red

        //codebox not editable
        $("#codeBox").attr("contenteditable", "false");

        // Make iframe unclickable
        let iframe = $("#preview");
        iframe.css("pointer-events", "none"); 

        // SEND THE CHAT TO AI
        let eventSource = new EventSource(`/generate_html/${encodeURIComponent(prompt)}`);

        // GENERATED CODE BOX AND PREVIEW BOX
        let generatedCode = "";

        $("#codeBox").text(""); // Clear previous output
        $("#preview").contents().find("html").html(""); // Clear preview

        //stream data response
        eventSource.onmessage = function (event) {
            let chunk = event.data;
            // Clean the chunk
            chunk = chunk.replace(/^html\s*/, ""); // Remove "html" at the beginning
            chunk = chunk.replace(/^```\s*/, ""); // Remove ``` at the beginning
            chunk = chunk.replace(/<\|EOT\|>$/, ""); // Remove <|EOT|> at the end

            /*
            // Disable buttons and links
            chunk = chunk
                .replace(/<a\s+([^>]*)href=["'][^"']*["']([^>]*)>/gi, '<span $1 $2>') // Remove href from <a>
                .replace(/<\/a>/gi, '</span>') // Replace closing </a> with </span>
                .replace(/<button\s+([^>]*)>/gi, '<button $1 disabled>'); // Disable <button>

            */
           
            // Append the cleaned chunk to the generated codebox
            $('#codeBox').append(chunk);
            generatedCode += chunk;

            //fromat the code
            let formattedCode = prettier.format(generatedCode, {
                parser: "html",
                plugins: window.prettierPlugins,
            });

            //update codebox with formatted code 
            $("#codeBox").text(formattedCode);
            //update codebox with syntax highlighter
            hljs.highlightElement(document.getElementById("codeBox"));
            // Update the preview iframe
            $("#preview").contents().find("html").html(generatedCode);

        };

        eventSource.onerror = function () {
            /*
            // Format the code using Prettier
            let formattedCode = prettier.format(generatedCode, {
                parser: "html",
                plugins: window.prettierPlugins,
            });

            // Update the code box with formatted code
            $("#codeBox").text(formattedCode);
            // Highlight the formatted code
            hljs.highlightElement(document.getElementById("codeBox"));
            // Update the preview iframe
            $("#preview").contents().find("html").html(generatedCode);

            */

            // Re-enable the all buttons and re-enaable the editable codebox and clickable iframe
            sendButton.prop("disabled", false);
            refresh_button.prop("disabled", false);
            restore_button.prop("disabled", false);
            copy_button.prop("disabled", false);
            sendButton.removeClass("bg-warning"); 
            refresh_button.css({"background-color": "", "color": ""});
            restore_button.css({"background-color": "", "color": ""});
            copy_button.css({"background-color": "", "color": "" });
            sendButton.text("Send ✈️");
            $("#codeBox").attr("contenteditable", "true");
            iframe.css("pointer-events", "auto"); // Make iframe clickable again
            eventSource.close();

        };

        //refresh iframe
        $("#refresh").on('click', function () {
            
            /*
            let reformat = prettier.format(generatedCode, {
                parser: "html",
                plugins: window.prettierPlugins,
            });
            $("#codeBox").text(reformat);
            //update codebox with syntax highlighter
            hljs.highlightElement(document.getElementById("codeBox"));
            */
           //fromat the code
            $("#preview").contents().find("html").html(generatedCode);
    
        })
        //restore code
        $("#restore").on('click', function () {
            //fromat the code
            let reformat = prettier.format(generatedCode, {
                parser: "html",
                plugins: window.prettierPlugins,
            });
            $("#codeBox").text(reformat);
            //update codebox with syntax highlighter
            hljs.highlightElement(document.getElementById("codeBox"));
            $("#preview").contents().find("html").html(generatedCode);
    
        })

    });
});

//copy to clipboard
$(document).ready(function () {
    // Handle copy button click event
    $('#copyButton').click(function () {
        var codeContent = $('#codeBox').text();
        
        // Create a temporary textarea to copy the code
        var $temp = $('<textarea>');
        $('body').append($temp);
        $temp.val(codeContent).select();
        document.execCommand('copy');
        $temp.remove();

        // SweetAlert notification on success
        Swal.fire({
            title: 'Copied!',
            text: 'The HTML code has been copied to your clipboard.',
            icon: 'success',
            timer: 2000,
            timerProgressBar: true
        });
    });
});

//view iframe button
$(document).ready(function () {
    const iframe = $('#preview')[0]; // Get the iframe DOM element

    // Function to open iframe content in full screen
    $('#fullscreenButton').on('click', function () {
        if (iframe.requestFullscreen) {
            iframe.requestFullscreen();
        } else if (iframe.mozRequestFullScreen) { // Firefox
            iframe.mozRequestFullScreen();
        } else if (iframe.webkitRequestFullscreen) { // Chrome, Safari, and Opera
            iframe.webkitRequestFullscreen();
        } else if (iframe.msRequestFullscreen) { // IE/Edge
            iframe.msRequestFullscreen();
        }
    });
});

//view code button
$(document).ready(function () {
    const codebox = $('#codeBox')[0]; // Get the iframe DOM element

    // Function to open iframe content in full screen
    $('#showCode').on('click', function () {
        if (codebox.requestFullscreen) {
            codebox.requestFullscreen();
        } else if (iframe.mozRequestFullScreen) { // Firefox
            codebox.mozRequestFullScreen();
        } else if (iframe.webkitRequestFullscreen) { // Chrome, Safari, and Opera
            codebox.webkitRequestFullscreen();
        } else if (iframe.msRequestFullscreen) { // IE/Edge
            codebox.msRequestFullscreen();
        }
    });
});

//EDITABLE CODEBOX
$(document).ready(function () {
    // Make the code box editable
    $("#codeBox").attr("contenteditable", "true");

    // Listen for input changes and update the preview iframe
    $("#codeBox").on("input", function () {
        let editedCode = $(this).text();
        $("#preview").contents().find("html").html(editedCode);
    });
});

//USE TAB
$(document).ready(function () {
    $("#codeBox").on("keydown", function (e) {
        if (e.key === "Tab") {
            e.preventDefault(); // Prevent default tab behavior
            let selection = window.getSelection();
            let range = selection.getRangeAt(0);
            let tabNode = document.createTextNode("\t");

            range.insertNode(tabNode);
            range.setStartAfter(tabNode);
            range.setEndAfter(tabNode);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    });
});

