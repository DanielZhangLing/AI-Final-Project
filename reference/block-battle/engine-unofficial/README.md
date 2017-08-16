![2015-11-18-034140_781x589_scrot.png](https://bitbucket.org/repo/RRGXgn/images/1045418092-2015-11-18-034140_781x589_scrot.png)

This is my engine to help AI programmers test their bots for [AI Block Battle](http://theaigames.com/competitions/ai-block-battle)

The engine tries to simulate the original engine, except it is open source and works offline.

It reads commands from stdin and prints updates to stdout.

How to Run
------------

Simply use named-pipes for connecting your bot to the engine.  
If you don't want to run Grunt, you can download [here](https://bitbucket.org/aecepoglu/tetris-engine/downloads)

    # open a terminal
    cd /path/to/tetris-engine
    npm install
	grunt
    mkfifo from-engine;
    mkfifo to-engine
    node_modules/.bin/electron ./ < to-engine | tee from-engine

    # open another terminal
    cd /path/to/your/bot
    ./your-bot-exe < /path/to/tetris-engine/from-engine > /path/to/to-engine

More
----------

* The lines your bot prints to stdout starting with '#' will be shown in log area
* Play move by move or play automatically
* Extract field data for easy debugging
