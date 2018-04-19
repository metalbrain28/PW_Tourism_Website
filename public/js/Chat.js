
function Chat () {}

Chat.prototype = {

    messagesList: [],

    initialize: function () {
        $(".chat-header.user").on("click", _.bind(this.toggleUserChat, this));
        $(document).on("keydown", ".message-input", _.bind(this.sendMessage, this))

        setInterval(_.bind(function refreshChat() {
            this.getMessages();
        }, this), 2000);
    },

    toggleUserChat: function(e) {
        var $chatWidget = $(e.target).parent().find('.chat-widget');

        if ($chatWidget.hasClass("hidden")) {
            this.getMessages().then(function() {
                $chatWidget.removeClass("hidden");
            });
        } else {
            $chatWidget.addClass("hidden");
        }
    },

    getMessages: function() {
        return $.ajax({
            method: "GET",
            url: "/chat",
            dataType: "json",
            success: _.bind(function(data) {
                data.chats = data.chats.reverse();

                if (this.messagesList.length) {
                    var lastRecvMessage = data.chats[data.chats.length - 1];
                    var lastCrtMessage = this.messagesList[this.messagesList.length - 1];
                }

                if (!this.messagesList.length || (lastRecvMessage.message !== lastCrtMessage.message && lastRecvMessage.side !== lastCrtMessage.side)) {
                    this.messagesList = _.map(data.chats, function(x) { return {"message": x.message, "side": x.side}; });
                    this.renderTemplate();

                    $(".chat-header").addClass("active");
                }
            }, this),
            error: function(err) {
                console.log(err);
            }
        });
    },

    renderTemplate: function() {
        var template = $("#conversation_template").html();
        $("#conversation_content").html(_.template(template)({messages: this.messagesList}));
    },

    sendMessage: function(e) {
        /* On enter, submit. */
        if (e.which === 13) {
            e.preventDefault();
            var message = e.target.value;

            this.messagesList.push({
                "message": message,
                "side": "right"
            });

            this.renderTemplate();
            $(e.target).val("");

            $.ajax({
                method: "POST",
                url: "/chat",
                dataType: "json",
                data: {
                    "chat_data": JSON.stringify({"message": message})
                },
                success: _.bind(function(data) {

                }, this),
                error: function(xhr) {
                    // TODO: render a "message not sent" next or smth
                    console.log(xhr);
                }
            });
        }
    }
};
