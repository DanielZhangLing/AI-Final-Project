from tetris import *
from random import randrange as rand

class TetrisRandom(TetrisApp):
    def bestMoves(self):
        for _ in xrange(rand(4)):
            self.rotate_stone()

        if rand(2):
            for _ in xrange(rand(6)):
                self.move(-1)
        else:
            for _ in xrange(rand(6)):
                self.move(+1)

        self.insta_drop()

if __name__ == '__main__':
	App = TetrisRandom()
	App.run()
