from tetris import *

class TetrisGreedy(TetrisApp):

    # take best moves based on algorithms, will be overriden by subclasses
    def bestMoves(self):
        x, low = 0, 0
        for j in xrange(len(self.board[0])):
            i = 0
            while not self.board[i][j]:
                i += 1
            if i > low:
                x, low = j, i

        self.move(x - self.stone_x)
        self.insta_drop()

if __name__ == '__main__':
	App = TetrisGreedy()
	App.run()
