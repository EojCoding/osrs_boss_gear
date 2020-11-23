# Boss Gear Bot  
<img src="./bossgear.png" width=500/>

#### Description:

Boss Gear is a bot that is designed to help you choose what gear to bring to a boss that you specify with a budget that you provide.

<br/>

## Getting started
Boss Gear Bot has many commands, most of them being abbreviations of boss names.  
To get a general feel for the bot start by using `~about` and `~help` commands.

*Those 2 commands will produce the following:*  
<img src="https://i.gyazo.com/9b3d5b48461bbed454cfa66cb11c54a7.png" width="500">

<img src="https://i.gyazo.com/4752f8c65b33ce3aac2bea1984a3a3b4.png" width="500">



## Commands Rundown
> ~report (message)  

If you encounter any bugs with the bot, or if you have any suggestions or general  
feedback, please use this command

> ~setrsn (your-player-name)  

Using this command will grab your information from the OSRS official hiscores page  
and attach it to your Discord ID, so you can only set one character at a time.  
There is currently no plan to support adding alts too.

> ~showstats  

Shows the stats for the character which you specified with `~setrsn`

> ~mybosslist (budget)  

After you have set your character name with `~setrsn` you will be able to use this  
command to have a list of bosses displayed to you which are available for the  
given budget and according to your player stats. An embedded message is sent to  
the channel which populates with reactions; clicking a reaction will have the bot  
DM you an embedded message with the gear set for that boss (see below).

*Using `~mybosslist 500m`*  
<img src="https://i.gyazo.com/a04b0b7b54fdf69bea9c42a5934d52d7.png" width="500">


*After clicking the kree reaction the bot will DM you*  
<img src="https://i.gyazo.com/15f6ffa06fb6a5245881387ec7042d2c.png" width="500">
<br />

> ~bosses  

This command simply lists the bosses which the bot has information for right now.  
This is continuously being updated.  

> ~(boss-name) (budget)  

Using `~bosses` will show you which individual boss commands are currently added.  
See below for an example using `~kree 3b`:

<img src="https://i.gyazo.com/66e4997abc247602db425c04fcabcd61.png" width="500">
