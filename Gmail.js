var mail = {
  LABELS: [],
  MAILS:[],
  TOTALMAIL:[],

  loadGmailApi:function() 
  {
    gapi.client.load('gmail', 'v1', mail.getMails);
  },
  
  getMails:function() 
  {
    var myRequest = gapi.client.gmail.users.labels.list({
      'userId': 'me'
    });

    myRequest.execute(function(resp) 
    {
      if (resp.labels && resp.labels.length > 0) 
      {
        for (var i = 0; i < resp.labels.length; i++) 
        {
            if(resp.labels[i].name.indexOf("Location") > -1)
            {
              mail.currentMail(resp.labels[i].id,resp.labels[i].name);
            }
        }
      }
      
      setTimeout(function() {gmaps.geocodeAddress(mail.TOTALMAIL);}, 2000);
    });
  },
  
  currentMail:function(labelid,labelname)
  {
    var myRequest = gapi.client.gmail.users.messages.list({
      'userId': 'me',
      'labelIds': labelid
    });
    
    myRequest.execute(function(resp)
    {
      if (resp.messages && resp.messages.length > 0) 
      {
        setTimeout(function() {mail.listCurrentMail(labelname,resp.messages[0].id);}, 700);
      }
    });
  },
  
  listCurrentMail:function(labelname,message)
  {
      var myRequest = gapi.client.gmail.users.messages.get
      ({
          'userId': 'me',
          'id': message
      });
      myRequest.execute(function(resp)
      {
        var fullMail = resp.payload.parts[1].body.data;
        
        if(fullMail === undefined)
        {
          fullMail = resp.payload.parts[0].parts[1].body.data;
        }
        var mailDecoded= atob( fullMail.replace(/-/g, '+').replace(/_/g, '/'));
            var item = {
              label: labelname,
              subject: resp.payload.headers[16].value,
              snippet: resp.snippet,
              fullmail:mailDecoded,
            };
            
              mail.TOTALMAIL.push(item);
      });
  },
};