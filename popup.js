$("document").ready(function () {
  var tc = $("#tc")
  var tr = $("#tr")
  var td = $("#td")
  var dd = $("#dd")
  var l_country = $("#btn")
  var lc = $("#lc")
  var lr = $("#lr")
  var ld = $("#ld")
  var country_code
  var ca=$('#c_arrow')
  var rc=$('#r_arrow')
  var dc=$('#d_arrow')
  var previous_day_confirm
  var previous_day_recover
  var previous_day_deaths



  $.ajax({
    url: 'https://get.geojs.io/v1/ip/geo.js',
  //   beforeSend: function () { // Before we send the request, remove the .hidden class from the spinner and default to inline-block.
  //     $(lc).removeClass('loader')
  // },

    success: function (data) {
      $(l_country).html(data.match(/"country":"([^"]+)"/)[1])
      console.log(data)
      country_code = data.match(/"country_code":"([^"]+)"/)[1]
      console.log(country_code)
    },
    async:false
  });
  console.log(country_code)

  var summary=$.ajax({
    url: 'https://api.covid19api.com/summary',
    
    async:false,
  //   beforeSend: function () { // Before we send the request, remove the .hidden class from the spinner and default to inline-block.

  // // },
    success: function (data) {
 
      //  console.log(data.Global.TotalConfirmed)

      var total_confirm = parseInt(data.Global.TotalConfirmed)
      var total_recovered = parseInt(data.Global.TotalRecovered)
      var total_deaths = parseInt(data.Global.TotalDeaths)
      var total_today_confirm = parseInt(data.Global.NewConfirmed)
      var total_tody_recovered = parseInt(data.Global.NewRecovered)
      var total_today_deaths = parseInt(data.Global.NewDeaths)
      
      for (var i = 0; i < data.Countries.length; i++) {
        
        if (data.Countries[i].CountryCode == country_code) {
          console.log(i)
      
          $(lc).html(formatNumber(parseInt(data.Countries[i].TotalConfirmed)))
          $(lr).html(formatNumber(parseInt(data.Countries[i].TotalRecovered)))
          $(ld).html(formatNumber(parseInt(data.Countries[i].TotalDeaths)))
           if ($(lr).html == 0) {
            lr.innerHTML = "Details are not available"
            lr.style.color = 'silver'
            break;
          }
          
        }
        else{
          lr.innerHTML="none"
        }
      }
      let date = data.Date
      $(tc).html(formatNumber(total_confirm))
      $(tr).html(formatNumber(total_recovered))
      $(td).html(formatNumber(total_deaths))
      $(ttc).html(formatNumber(total_today_confirm))
      $(ttr).html(formatNumber(total_tody_recovered))
      $(ttd).html(formatNumber(total_today_deaths))
      $(dd).html(date)
    }
  }).responseJSON;


  let yesterday = new Date(new Date().setDate(new Date().getDate()-1)).toISOString();
  console.log(yesterday)


;
  var previous_day=$.ajax({
    type:'GET',
      url:`https://api.covid19api.com/world`,
      success:function(data){
      },
     async:false
  }).responseJSON
  var index


    for(index=0;index<previous_day.length;index++){
      if(previous_day[index].Date.split("T")[0]==yesterday.split("T")[0]){
        console.log(previous_day[index])
        break;
      }
    }
    console.log(index)
        previous_day_confirm=previous_day[index].NewConfirmed
        previous_day_recover=previous_day[index].NewRecovered
        previous_day_deaths=previous_day[index].NewDeaths
      console.log(summary.Global.NewConfirmed)
       $(ca).html(arrow_behavior(summary.Global.NewConfirmed,previous_day_confirm))
       $(rc).html(arrow_behavior(summary.Global.NewRecovered,previous_day_recover))
       $(dc).html(arrow_behavior(summary.Global.NewDeaths,previous_day_deaths))
  function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  function arrow_behavior(new_result,previous_result){
    var pr=parseInt(previous_result)
    var nr=parseInt(new_result)
    console.log(nr,pr)
    if(nr>pr){
      return "+"+Math.round((nr-pr)*100/(nr+pr))
      // console.log((nr-pr)*100/(nr+pr))
    }
    else if(nr<pr){
      return Math.round(((nr-pr)*100/(nr+pr)))
      
      // console.log((nr-pr)*100/(nr+pr))
     
    }
 
  }
 
});

