// Copyright 2015 theaigames.com (developers@theaigames.com)

//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at

//        http://www.apache.org/licenses/LICENSE-2.0

//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.
//	
//    For the full copyright and license information, please view the LICENSE
//    file that was distributed with this source code.


package com.theaigames.engine;

import com.theaigames.engine.io.IOPlayer;
import java.io.IOException;
import java.util.ArrayList;
/**
 * Engine class
 * 
 * DO NOT EDIT THIS FILE
 * 
 * A general engine to implement IO for bot classes
 * All game logic is handled by implemented Logic interfaces.
 * 
 * @author Jackie Xu <jackie@starapple.nl>, Jim van Eeden <jim@starapple.nl>
 */
public class Engine {
    
    private boolean isRunning; // Boolean representing current engine running state
    private Logic logic; // Class implementing Logic interface; handles all data
    private ArrayList<IOPlayer> players; // ArrayList containing player handlers
    
    // Engine constructor 
    public Engine() {
        this.isRunning = false;
        this.players = new ArrayList<IOPlayer>();
    }
    
    /**
     * Start up the bot process and add the player to the game
     * @param command : command to start a bot process
     */
    public void addPlayer(String command, String idString) throws IOException {

        // Create new process
    	Process process = Runtime.getRuntime().exec(command);
    	System.out.println(command);

        // Attach IO to process
        IOPlayer player = new IOPlayer(process, idString);
        
        // Add player
        this.players.add(player);

        // Start running
        player.run();
    }
    
    /**
     * Sets the game's logic
     * @param logic
     */
    public void setLogic(Logic logic) {
        this.logic = logic;
    }
    
    /**
     * Determines whether the game has ended
     * @return : true if the game has ended
     */
    public boolean hasEnded() {
        return this.logic.isGameOver();
    }
    
    /**
     * @return : A list of all the players in this game
     */
    public ArrayList<IOPlayer> getPlayers() {
    	return this.players;
    }
    
    /**
     * Starts the game
     */
    public void start() throws Exception {
    	
    	int round = 0;
        
        // Set engine to running
        this.isRunning = true;
        
        // Set up game settings
        this.logic.setupGame(this.players);

        // Keep running
        while (this.isRunning) {
        	
        	round++;

            // Play a round
            this.logic.playRound(round);
            
            // Check if win condition has been met
            if (this.hasEnded()) {
            	
                System.out.println("stopping...");
                
                // Stop running
                this.isRunning = false;
                
                // Close off everything
                try {
                	this.logic.finish();
                } catch (Exception ex) {
                    System.out.println(ex);
                }
            }
        }
    }
    
}
