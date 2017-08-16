from tetris import TetrisApp
from state import *
import random as rand

EPSILON, ALPHA, GAMA = 0.1, 0.005, 0.9

qValues = {}
weights = [0.5, -0.5, -0.5, -0.5, -0.5]

class RL(object):

    def __init__(self, state):
        self.state = state
        self.board = state.board
        self.lineScore = state.score
        self.heights = self.getHeights()
        self.score = self.evaluate()

    def evaluate(self):
        f0 = self.getLinesCleaned()
        f1 = self.getTotalHeight()
        f2 = self.getMaxHeight()
        f3 = self.getHoles()
        f4 = self.getDeltas()

        # score = 0.760666 * f0 - 0.510066 * f1 - 0.35663 * f3 - 0.184483 * f4
        score = weights[0]*f0 + weights[1]*f1 + weights[2]*f2 + weights[3]*f3 + weights[4]*f4
        return score

    def getHeights(self):
        heights = []
        for x in xrange(COLS):
            heights.append(0)
            for y in xrange(ROWS):
                if self.board[y][x]:
                    heights[x] = ROWS - y
                    break
        return heights

    def getTotalHeight(self):
        return sum(self.heights)

    def getMaxHeight(self):
        return max(self.heights)

    def getLinesCleaned(self):
        s = [0, 40, 100, 300, 1200]
        if self.lineScore in s:
            return ([0, 40, 100, 300, 1200]).index(self.lineScore)
        else:
            return 0

    def getDeltas(self):
        res = 0
        for i, h in enumerate(self.heights):
            if i:
                res += abs(self.heights[i] - self.heights[i - 1])
        return res

    def getHoles(self):
        res = 0
        for x in xrange(COLS):
            flag = False
            for y in xrange(ROWS):
                if self.board[y][x]:
                    flag = True
                elif flag:
                    res += 1
        return res


class TetrisRL(TetrisApp):

    # take best moves based on algorithms, will be overriden by subclasses
    def bestMoves(self):
        bestScore, bestAction = float("-inf"), None
        initState = State(self.board, self.score, self.stone, self.next_stone)
        rlstate = RL(initState)
        f = [rlstate.getLinesCleaned(), rlstate.getTotalHeight(), rlstate.getMaxHeight(),
             rlstate.getHoles(), rlstate.getDeltas()]

        # update weights
        if rand.random() < EPSILON:
            rotateN = rand.randrange(4)
            if rotateN & 1:
                maxX = COLS - len(initState.block) + 1
            else:
                maxX = COLS - len(initState.block[0]) + 1
            x = rand.randrange(maxX + 1)
            action = (rotateN, x)
            nextStates = initState.nextStates(action)
            if len(nextStates):
                nextState = nextStates[0]
                nextNextStates = nextStates[1:70]
                nextNextStateScore = []
                for nextNextState in nextNextStates:
                    nextNextStateScore.append(RL(nextNextState).evaluate())
                difference = rlstate.getMaxHeight() - RL(nextState).getMaxHeight() + GAMA * max(nextNextStateScore) - RL(nextState).evaluate()
                for i, w in enumerate(weights):
                    weights[i] = weights[i] * (1-ALPHA) + ALPHA * difference * f[i]
        else:
            for rotateN in xrange(4):
                for x in xrange(COLS):
                    action = (rotateN, x)
                    nextStates = initState.nextStates(action)
                    if len(nextStates):
                        score = RL(nextStates[0]).score
                        if score > bestScore:
                            bestScore, bestAction = score, action

            nextStates = initState.nextStates(bestAction)
            if len(nextStates):
                nextState = nextStates[0]
                for i, w in enumerate(weights):
                    weights[i] += ALPHA * (nextState.score + RL(nextState).evaluate() - RL(initState).evaluate()) * f[i]

        # pick best action based on updated value
        for rotateN in xrange(4):
            for x in xrange(COLS):
                action = (rotateN, x)
                nextStates = initState.nextStates(action)
                if len(nextStates):
                    score = RL(nextStates[0]).score
                    if score > bestScore:
                        bestScore, bestAction = score, action

        if not self.gameover:
            for _ in xrange(bestAction[0]):
                self.rotate_stone()
            self.move(bestAction[1] - self.stone_x)
            self.insta_drop()

if __name__ == '__main__':
    App = TetrisRL()
    App.run()
