
fetch('https://jsonplaceholder.typicode.com/comments')
  .then(response => response.json())
  .then(result => {
    result.map(i => users.push(i))
    render()
  })
const users = []

function render() {
  const table = document.querySelector('#table')
  const tbody = document.createElement('tbody')
  const pagination = document.querySelector('#pagination')
  const notesOnPage = 50
  const countOfItems = Math.ceil(users.length / notesOnPage)
  const items = [];


  for (let i = 1; i <= countOfItems; i++) {
    let li = document.createElement('li')
    li.innerHTML = i;
    pagination.appendChild(li)
    items.push(li)
  }

  showPage(items[0])
  sortTableByColumn(table, 0, true)

  for (let item of items) {
    item.addEventListener('click', function () {
      showPage(this)
      sortTableByColumn(table, 0, true)
    })
  }

  function showPage(item) {
    let active = document.querySelector('#pagination li.active')
    if (active) {
      active.classList.remove('active')
    }
    item.classList.add('active')
    let pageNum = +item.innerHTML
    let start = (pageNum - 1) * notesOnPage;
    let end = start + notesOnPage
    let notes = users.slice(start, end)
    tbody.innerHTML = ''
    document.querySelector('.search').value = ''

    notes.forEach((i) => {
      let tr = document.createElement('tr')
      tbody.appendChild(tr);
      table.appendChild(tbody)
      createCell(i.id, tr, 'id')
      createCell(i.name, tr, 'name')
      createCell(i.email, tr, 'email')
      //live search
      document.querySelector('.search').oninput = function () {
        let val = this.value.trim();
        if (val != '') {
          Array.from(document.querySelectorAll('tr')).forEach(function (item) {
            if (item.innerText.search(val) == -1) {
              item.classList.remove('show')
              item.classList.add('hide')
            } else {
              item.classList.remove('hide')
              item.classList.add('show')
            }
          })
        } else {
          Array.from(document.querySelectorAll('tr')).forEach(function (item) {
            item.classList.remove('hide')
            item.classList.add('show')
            showPage(items[0])
          })
        }
      }

    })
  }

  function createCell(str, tr, id) {
    let td = document.createElement('td')
    td.innerHTML = str
    td.setAttribute('datatype', id)
    tr.appendChild(td);
  }

  function sortTableByColumn(table, col, asc = true) {
    const dirModifier = asc ? 1 : -1;
    const tBody = table.tBodies[0]
    const rows = Array.from(tBody.querySelectorAll('tr'));


    const sortedRows = rows.sort((a, b) => {
      const aColText = a.querySelector(`td:nth-child(${col + 1})`)
      const bColText = b.querySelector(`td:nth-child(${col + 1})`);
      let selector = aColText.getAttribute('datatype')
      if (selector == 'id') {
        return +aColText.innerText > +bColText.innerText ? (1 * dirModifier) : (-1 * dirModifier);
      } else {
        return aColText.textContent.trim() > bColText.textContent.trim() ? (1 * dirModifier) : (-1 * dirModifier);
      }

    })
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }

    tBody.append(...sortedRows);
    table.querySelectorAll('th').forEach(th => th.classList.remove('th-sort-asc', 'th-sort-desc'))
    table.querySelector(`th:nth-child(${col + 1})`).classList.toggle('th-sort-asc', asc)
    table.querySelector(`th:nth-child(${col + 1})`).classList.toggle('th-sort-desc', !asc)
  }

  document.querySelectorAll('.table-sortable th').forEach(headerCell => {
    headerCell.addEventListener('click', () => {
      const tableElement = headerCell.parentElement.parentElement.parentElement;
      const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell)
      const currentIsAscending = headerCell.classList.contains('th-sort-asc');

      sortTableByColumn(tableElement, headerIndex, !currentIsAscending)
    })
  })
}
