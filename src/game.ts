enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}

export default class Game {
  board: number[][]
  score: number

  constructor() {
    this.board = []
    this.score = 0
    this.initBoard()
    this.addNewNumber()
    this.addNewNumber()
    this.bindEvent()
    this.updateView()
  }

  initBoard() {
    this.board = Array(4)
      .fill(null)
      .map(() => Array(4).fill(0))
  }

  addNewNumber() {
    const emptyCells = []
    // 获取当前空白格子的位置
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ x: i, y: j })
        }
      }
    }
    // 如果有空白格子，随机选择一个空白格子添加数字 2 或者 4
    if (emptyCells.length > 0) {
      // 随机选择一个空白格子
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
      // 随机添加数字 2 或者 4
      this.board[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4
    }
  }

  move(direction: Direction) {
    // 是否已经移动
    let moved = false
    // 复制一份当前的棋盘
    const newBoard = this.board.map(row => [...row])

    // 根据方向移动数字
    switch (direction) {
      case Direction.Left:
        for (let i = 0; i < 4; i++) {
          // 在行中找到格子内不为 0 的
          let row = this.board[i].filter(cell => cell !== 0)
          for (let j = 0; j < row.length - 1; j++) {
            // 如果当前格子和下一个格子相等，合并到当前格子，同时删除下一个格子
            if (row[j] === row[j + 1]) {
              row[j] *= 2
              // 增加分数
              this.score += row[j]
              // 删除下一个格子
              row.splice(j + 1, 1)
              // 标记已经移动
              moved = true
            }
          }
          // 如果移动了，在格子后面补 0
          const newRow = row.concat(Array(4 - row.length).fill(0))
          // 如果移动后的格子和原来的格子不同，标记已经移动
          if (newRow.join(',') !== this.board[i].join(',')) moved = true
          // 更新棋盘
          newBoard[i] = newRow
        }
        break
      case Direction.Right:
        for (let i = 0; i < 4; i++) {
          let row = this.board[i].filter(cell => cell !== 0)
          for (let j = row.length - 1; j > 0; j--) {
            if (row[j] === row[j - 1]) {
              row[j] *= 2
              this.score += row[j]
              row.splice(j - 1, 1)
              moved = true
            }
          }
          const newRow = Array(4 - row.length)
            .fill(0)
            .concat(row)
          if (newRow.join(',') !== this.board[i].join(',')) moved = true
          newBoard[i] = newRow
        }
        break
      case Direction.Up:
        for (let j = 0; j < 4; j++) {
          // 在列中找到格子内不为 0 的
          let col = this.board.map(row => row[j]).filter(cell => cell !== 0)
          for (let i = 0; i < col.length - 1; i++) {
            if (col[i] === col[i + 1]) {
              col[i] *= 2
              this.score += col[i]
              col.splice(i + 1, 1)
              moved = true
            }
          }
          const newCol = col.concat(Array(4 - col.length).fill(0))
          if (newCol.join(',') !== this.board.map(row => row[j]).join(',')) moved = true
          for (let i = 0; i < 4; i++) {
            newBoard[i][j] = newCol[i]
          }
        }
        break
      case Direction.Down:
        for (let j = 0; j < 4; j++) {
          let col = this.board.map(row => row[j]).filter(cell => cell !== 0)
          for (let i = col.length - 1; i > 0; i--) {
            if (col[i] === col[i - 1]) {
              col[i] *= 2
              this.score += col[i]
              col.splice(i - 1, 1)
              moved = true
            }
          }
          const newCol = Array(4 - col.length)
            .fill(0)
            .concat(col)
          if (newCol.join(',') !== this.board.map(row => row[j]).join(',')) moved = true
          for (let i = 0; i < 4; i++) {
            newBoard[i][j] = newCol[i]
          }
        }
        break
    }

    // 如果已经移动了，更新棋盘
    if (moved) {
      this.board = newBoard
      // 添加新的数字
      this.addNewNumber()
      // 更新视图
      this.updateView()
      // 判断游戏是否结束
      if (this.isGameOver()) {
        alert('Game Over!')
      }
    }
  }

  isGameOver() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        // 如果有格子为 0，说明游戏没有结束
        if (this.board[i][j] === 0) return false
        // 如果有格子和它右边或者下边的格子相等，说明游戏没有结束
        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) return false
        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) return false
      }
    }
    return true
  }

  updateView() {
    const board = document.getElementById('board')!
    // 清空原来的格子
    board.innerHTML = ''
    // 重新添加格子
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const cell = document.createElement('div')
        cell.className = 'cell'
        cell.textContent = `${this.board[i][j]}` || ''
        board.appendChild(cell)
      }
    }
    // 更新分数
    document.getElementById('score')!.textContent = `${this.score}`
  }

  bindEvent() {
    // 绑定键盘事件
    document.addEventListener('keydown', e => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          this.move(Direction.Left)
          break
        case 'ArrowRight':
          e.preventDefault()
          this.move(Direction.Right)
          break
        case 'ArrowUp':
          e.preventDefault()
          this.move(Direction.Up)
          break
        case 'ArrowDown':
          e.preventDefault()
          this.move(Direction.Down)
          break
      }
    })
  }
}