var admin = require("firebase-admin");
var serviceAccount = require("../service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://vue-auth-test-d1926.firebaseio.com"
});

const faker = require("faker");
const { hacker } = require("faker");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;

const config = require("../firebase.config");

const db = admin.firestore();
const TimeStamp = admin.firestore.Timestamp;

function string_to_slug(str) {
  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to = "aaaaeeeeiiiioooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes

  return str;
}
// eslint-disable-next-line
const sessionTitles = ['What Zombies Can Teach You About ...','How To Get (A) Fabulous ... On A Tight Budget','Rules Not To Follow About ...','Best ... Android/iPhone Apps','Avoid The Top 10 Mistakes Made By Beginning ...','Open The Gates For ... By Using These Simple Tips','How To Sell ...','The Ultimate Deal On ...','Sexy ...','The Death Of ... And How To Avoid It','How To Become Better With ... In 10 Minutes','14 Days To A Better ...','Fall In Love With ...','At Last, The Secret To ... Is Revealed','15 Tips For ... Success','Little Known Ways to ...','3 Things Everyone Knows About ... That You Don\'t','Why My ... Is Better Than Yours','Can You Really Find ... (on the Web)?','Why Most ... Fail','The Secret of Successful ...','How We Improved Our ... In One Week(Month, Day)','How To Teach ... Like A Pro','7 and a Half Very Simple Things You Can Do To Save ...','3 Ways Twitter Destroyed My ... Without Me Noticing','Fascinating ... Tactics That Can Help Your Business Grow','Why ... Is The Only Skill You Really Need','5 Brilliant Ways To Use ...','Find Out Now, What Should You Do For Fast ...?','Revolutionize Your ... With These Easy-peasy Tips','How To Start ... With Less Than $100','27 Ways To Improve ...','10 Things You Have In Common With ...','How To Handle Every ... Challenge With Ease Using These Tips','Short Story: The Truth About ...','5 Simple Steps To An Effective ... Strategy','Succeed With ... In 24 Hours','3 Mistakes In ... That Make You Look Dumb','Want To Step Up Your ...? You Need To Read This First','What Can You Do To Save Your ... From Destruction By Social Media?','Do ... Better Than Barack Obama','The Number One Reason You Should (Do) ...','What Your Customers Really Think About Your ...?','Don\'t Be Fooled By ...','The Untapped Gold Mine Of ... That Virtually No One Knows About','Learn Exactly How I Improved ... In 2 Days','You Will Thank Us - 10 Tips About ... You Need To Know','Avoid The Top 10 ... Mistakes','Never Changing ... Will Eventually Destroy You','World Class Tools Make ... Push Button Easy','Savvy|Smart|Sexy People Do ... :)','Secrets To Getting ... To Complete Tasks Quickly And Efficiently','12 Questions Answered About ...','What Everyone Must Know About ...','What Can Instagramm Teach You About ...','Does ... Sometimes Make You Feel Stupid?','Death, ... And Taxes','... Made Simple - Even Your Kids Can Do It','...: What A Mistake!','Cracking The ... Code','52 Ways To Avoid ... Burnout','5 Best Ways To Sell ...','OMG! The Best ... Ever!','This Study Will Perfect Your ...: Read Or Miss Out','15 Unheard Ways To Achieve Greater ...','How To Save Money with ...?','Who Else Wants To Know The Mystery Behind ...?','Fear? Not If You Use ... The Right Way!','... - So Simple Even Your Kids Can Do It','... Your Way To Success','How To Earn $398/Day Using ...','Why Most People Will Never Be Great At ...','...: The Samurai Way','The Truth About ... In 3 Minutes','Using 7 ... Strategies Like The Pros','How To Make Your ... Look Like A Million Bucks','Ho To (Do) ... Without Leaving Your Office(House).','Get Rid of ... For Good','... Expert Interview','Stop Wasting Time And Start ...','How To Take The Headache Out Of ...','What Alberto Savoia Can Teach You About ...','Essential ... Smartphone Apps','10 Unforgivable Sins Of ...','No More Mistakes With ...','5 Ways You Can Get More ... While Spending Less','3 Easy Ways To Make ... Faster','The Ultimate Secret Of ...','5 Ways ... Will Help You Get More Business','Warning: These 9 Mistakes Will Destroy Your ...','5 Easy Ways You Can Turn ... Into Success','... Strategies For Beginners','Got Stuck? Try These Tips To Streamline Your ...','Your Key To Success: ...','15 Lessons About ... You Need To Learn To Succeed','Get Better ... Results By Following 3 Simple Steps','How To Make More ... By Doing Less','Is ... Worth [$] To You?','10 Tips That Will Make You Influential In ...','The Secret of ...','Where Is The Best ...?','Being A Star In Your Industry Is A Matter Of ...','The Untold Secret To Mastering ... In Just 3 Days','Here Is A Method That Is Helping ...','The ... That Wins Customers','How To Turn ... Into Success','The Single Most Important Thing You Need To Know About ...','5 Romantic ... Ideas','The Lazy Man\'s Guide To ...','The Secrets To Finding World Class Tools For Your ... Quickly','3 ... Secrets You Never Knew','10 Warning Signs Of Your ... Demise','These 5 Simple ... Tricks Will Pump Up Your Sales Almost Instantly','What You Should Have Asked Your Teachers About ...','Why ... Is No Friend To Small Business','Now You Can Buy An App That is Really Made For ...','22 Tips To Start Building A ... You Always Wanted','The Philosophy Of ...','The A - Z Guide Of ...','7 Rules About ... Meant To Be Broken','In 10 Minutes, I\'ll Give You The Truth About ...','A Surprising Tool To Help You ...','The Secret Of ...','Everything You Wanted to Know About ... and Were Afraid To Ask','Marriage And ... Have More In Common Than You Think','10 Ways To Reinvent Your ...','9 Ridiculous Rules About ...','The Ultimate Guide To ...','The Biggest Lie In ...','How To Find The Right ... For Your Specific Product(Service).','Remarkable Website - ... Will Help You Get There','Take The Stress Out Of ...','3 Ways To Master ... Without Breaking A Sweat','3 Ways Create Better ... With The Help Of Your Dog','10 Best Practices For ...','The Ugly Truth About ...','Should Fixing ... Take 60 Steps?','There’s Big Money In ...','5 Things To Do Immediately About ...','5 Incredibly Useful ... Tips For Small Businesses','... And Love - How They Are The Same','... Is Essential For Your Success. Read This To Find Out Why','How To Lose Money With ...','Top 10 Tips With ...','Double Your Profit With These 5 Tips on ...','You Can Thank Us Later - 3 Reasons To Stop Thinking About ...','4 Ways You Can Grow Your Creativity Using ...','Clear And Unbiased Facts About ... (Without All the Hype)','The ... Mystery Revealed','How To Start A Business With ...','Lies And Damn Lies About ...','How I Improved My ... In One Easy Lesson','How To Win Buyers And Influence Sales with ...','Make Your ... A Reality','...: An Incredibly Easy Method That Works For All','Why I Hate ...','... Adventures','Why ... Succeeds','Why You Really Need (A) ...','Have You Heard? ... Is Your Best Bet To Grow','Can You Pass The ... Test?','How You Can (Do) ... In 24 Hours Or Less For Free','Everything You Wanted to Know About ... and Were Too Embarrassed to Ask','To People That Want To Start ... But Are Affraid To Get Started','It\'s All About (The) ...','How To Make Your ... Look Amazing In 5 Days','If You Do Not (Do)... Now, You Will Hate Yourself Later','...? It\'s Easy If You Do It Smart','Turn Your ... Into A High Performing Machine','Why Ignoring ... Will Cost You Time and Sales','... And Love Have 4 Things In Common','If You Want To Be A Winner, Change Your ... Philosophy Now!','Boost Your ... With These Tips','The Next 3 Things To Immediately Do About ...','5 Surefire Ways ... Will Drive Your Business Into The Ground','The Secrets To ...','Find A Quick Way To ...','Old School ...','7 Easy Ways To Make ... Faster','Wondering How To Make Your ... Rock? Read This!','How To Learn ...','2 Ways You Can Use ... To Become Irresistible To Customers','How To Quit ... In 5 Days','The Lazy Way To ...','The Hidden Mystery Behind ...','What You Can Learn From Bill Gates About ...','Congratulations! Your ... Is (Are) About To Stop Being Relevant','How To Win Friends And Influence People with ...','... Works Only Under These Conditions','Proof That ... Really Works','Take 10 Minutes to Get Started With ...','11 Methods Of ... Domination','Guaranteed No Stress ...','101 Ideas For ...','Some People Excel At ... And Some Don\'t - Which One Are You?','3 Ways You Can Reinvent ... Without Looking Like An Amateur','Beware The ... Scam','10 Secret Things You Didn\'t Know About ...','Master (Your) ... in 5 Minutes A Day','3 Ways To Have (A) More Appealing ...','... Is Bound To Make An Impact In Your Business','How ... Made Me A Better Salesperson','How To Win Clients And Influence Markets with ...','Don\'t Just Sit There! Start ...','Top 3 Ways To Buy A Used ...','Little Known Ways To Rid Yourself Of ...','If ... Is So Terrible, Why Don\'t Statistics Show It?','5 Brilliant Ways To Teach Your Audience About ...','How You Can (Do) ... Almost Instantly','Where Can You Find Free ... Resources','The Best Way To ...','... Shortcuts - The Easy Way','Why Everything You Know About ... Is A Lie','5 Reasons ... Is A Waste Of Time','3 Simple Tips For Using ... To Get Ahead Your Competition','Want A Thriving Business? Focus On ...!','The Ultimate Guide To ...','Want More Money? Start ...','Learn To (Do) ... Like A Professional','Learn How To Start ...','The Truth Is You Are Not The Only Person Concerned About ...','Never Suffer From ... Again','2 Things You Must Know About ...','Here\'s A Quick Way To Solve A Problem with ...','Answered: Your Most Burning Questions About ...','Could This Report Be The Definitive Answer To Your ...?','5 Ways Of ... That Can Drive You Bankrupt - Fast!','5 Actionable Tips on ... And Twitter.','Never Lose Your ... Again','Proof That ... Is Exactly What You Are Looking For','The Anthony Robins Guide To ...','Best 50 Tips For ...','Why You Never See ... That Actually Works','How I Improved My ... In One Day','What Everyone Ought To Know About ...','Quick and Easy Fix For Your ...','Who Else Wants To Be Successful With ...','... An Incredibly Easy Method That Works For All','13 Myths About ...','How To Make Your Product Stand Out With ...','Listen To Your Customers. They Will Tell You All About ...','Best Make ... You Will Read This Year (in 2015)',"What Is ... and How Does It Work?","The Quickest & Easiest Way To ...","5 Problems Everyone Has With ... – How To Solved Them","Are You Embarrassed By Your ... Skills? Here's What To Do","... Smackdown!","Now You Can Have The ... Of Your Dreams – Cheaper/Faster Than You Ever Imagined","Who Else Wants To Enjoy ...","Top 25 Quotes On ...","Find Out How I Cured My ... In 2 Days","Learn Exactly How We Made ... Last Month","A Guide To ... At Any Age","Are You Making These ... Mistakes?","How To Buy (A) ... On A Tight Budget","7 Ways To Keep Your ... Growing Without Burning The Midnight Oil","...: This Is What Professionals Do","How To Improve At ... In 60 Minutes","What Make ... Don't Want You To Know","Sick And Tired Of Doing ... The Old Way? Read This","Now You Can Have Your ... Done Safely","Get Rid of ... Once and For All","Here Is A Quick Cure For ...","Top 10 Tips To Grow Your ...","Apply These 5 Secret Techniques To Improve ...","How To Teach ... Better Than Anyone Else","Here Is What You Should Do For Your ...","9 Ways ... Can Make You Invincible","5 Ways To Get Through To Your ...","Interesting Facts I Bet You Never Knew About ...","Need More Time? Read These Tips To Eliminate ...","... And The Chuck Norris Effect","Don't Fall For This ... Scam","10 Funny ... Quotes","17 Tricks About ... You Wish You Knew Before","...: Do You Really Need It? This Will Help You Decide!","5 Secrets: How To Use ... To Create A Successful Business(Product)","SuperEasy Ways To Learn Everything About ...","Use ... To Make Someone Fall In Love With You","3 Tips About ... You Can't Afford To Miss","... Is Crucial To Your Business. Learn Why!","Why Some People Almost Always Make/Save Money With ...","The Untold Secret To ... In Less Than Ten Minutes","Picture Your ... On Top. Read This And Make It So","At Last, The Secret To ... Is Revealed","I Don't Want To Spend This Much Time On .... How About You?","How To Use ... To Desire","Get The Most Out of ... and Facebook","You Don't Have To Be A Big Corporation To Start ...","10 Ways To Immediately Start Selling ...","Improve(Increase) Your ... In 3 Days","Read This Controversial Article And Find Out More About ...","How To Deal With(A) Very Bad ...","Believe In Your ... Skills But Never Stop Improving","Secrets To ... – Even In This Down Economy","... Iphone Apps","What Can You Do About ... Right Now","Winning Tactics For ...","How To Turn Your ... From Zero To Hero","5 Sexy Ways To Improve Your ..."];
let times = [];
const now = new Date();
times.push(now.setMinutes(0, 0, 0));
times.push(now.setMinutes(30, 0, 0));
times.push(now.setMinutes(60, 0, 0));
times.push(now.setMinutes(30, 0, 0));
times.push(now.setMinutes(-90, 0, 0));

let sessionTypes = ["panel", "discussion", "workshop", "presentation"];

const createUser = async () => {
  try {
    const username = faker.internet.userName();
    const data = {
      displayName: username,
      email: faker.internet.email(),
      verified: faker.random.boolean(),
      username: `${username}-123`,
      avatar: faker.internet.avatar(),
      watched: [],
      joined: []
    };
    const userData = await admin.auth().createUser({ email: data.email });
    db.collection("users")
      .doc(userData.uid)
      .set(data);
  } catch (error) {
    console.log(error.message);
  }
  return;
};

const createSession = async users => {
  try {
    const noun = hacker.noun();
    const user = users.docs[Math.floor(Math.random() * users.docs.length)];
    const title = sessionTitles[
      Math.floor(Math.random() * sessionTitles.length)
    ].replace("...", `${noun.slice(0, 1).toUpperCase()}${noun.slice(1)}`);
    const slug = string_to_slug(title);
    const startTime = new Date(times[Math.floor(Math.random() * times.length)]);

    const numTags = Math.floor(Math.random() * 3) + 1;
    const tags = [`${noun.slice(0, 1).toUpperCase()}${noun.slice(1)}`];
    for (let i = 0; i < numTags; i++) {
      const tag = hacker.noun();
      tags.push(`${tag.slice(0, 1).toUpperCase()}${tag.slice(1)}`);
    }

    let session = await db.collection("sessions").add({
      title: title,
      active: false,
      slug,
      startTime: admin.firestore.Timestamp.fromDate(startTime),
      endTime: admin.firestore.Timestamp.fromDate(
        new Date(startTime.setMinutes(startTime.getMinutes() + 30))
      ),
      type: sessionTypes[Math.floor(Math.random() * sessionTypes.length)],
      details: faker.lorem.paragraph(),
      created_by: user.id,
      tags,
      handsRaised: [],
      questions: [],
      visible: [],
      kicked: []
    });
    return;
  } catch (error) {
    return error.message;
  }
};

const clearSessions = async () => {
  try {
    const sessionCollection = await db.collection("sessions").get();
    sessionCollection.forEach(doc => {
      db.collection("sessions")
        .doc(doc.id)
        .delete();
    });
  } catch (error) {
    console.log(error.message);
  }
};

const clearUsers = async () => {
  try {
    const sessionCollection = await db.collection("users").get();
    sessionCollection.forEach(doc => {
      //   if (doc.id !== "t98k94k7y9fRQ9zscrUtBC5fHo12") {
      db.collection("users")
        .doc(doc.id)
        .delete();
      //   }
    });
  } catch (error) {
    console.log(error.message);
  }
  return;
};

if (argv.clearSessions) {
  clearSessions();
}
if (argv.clearUsers) {
  async () => await clearUsers();
  admin
    .auth()
    .listUsers(1000)
    .then(function(listUsersResult) {
      listUsersResult.users.forEach(function(userRecord) {
        admin.auth().deleteUser(userRecord.toJSON().uid);
      });
    })
    .catch(function(error) {
      console.log("Error listing users:", error);
    });
}

if (argv.users) {
  for (let i = 0; i < argv.users; i++) {
    createUser();
  }
}
if (argv.sessions) {
  db.collection("users")
    .get()
    .then(users => {
      for (let i = 0; i < argv.sessions; i++) {
        createSession(users);
      }
    });
}
