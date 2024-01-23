const axiosInstance = axios.create({
    baseURL : 'http://localhost:3000/api'
});

function validate () {
    const amount = document.getElementById('amount').value;
    const discription = document.getElementById('discription').value;
    const catagory = document.getElementById('catagory ').value;

    if(!amount){
        alert('Enter Your Amount');
        return false;
    }
    if(!discription){
        alert('Enter Your Discription');
        return false;
    }
    // if(catagory){
    //     alert('Choose Your Catagory');
    //     return false;
    // }
    return true;
}

async function handleFormSubmit (event) {
    if(validate){
        event.preventDefault();

        const amount = event.target.amount.value;
        const discription = event.target.discription.value;
        const catagory = event.target.catagory.value;

        const obj = {
            amount,
            discription,
            catagory
        };

        try {
            const res = await axiosInstance.post('/expenses', obj);
            console.log(res.data);
            showNewExpense(res.data);
        } catch (err) {
            console.log(err);
            alert(err.message);
        }
    }
}

window.addEventListener('DOMContentLoaded', async() => {
    try {
        const res = await axiosInstance.get('/expenses');
    
        for(let i=0; i<res.data.length; i++){
            showNewExpense(res.data[i]);
        }
    } catch (err) {
        console.log(err);
        alert(err.message);
    }
});

function showNewExpense (obj) {
    const tbody = document.querySelector('tbody');

    tbody.innerHTML += `<tr>
        <td>${obj.amount}</td>
        <td style="white-space: normal; word-wrap: break-word;">${obj.discription}</td>
        <td>${obj.catagory}</td>
        <td>
        <button type="button" class="btn btn-info" onclick="editExpense(${obj.id}, this)">Edit</button>
        <button type="button" class="btn btn-danger" onclick="deleteExpense(${obj.id}, this)">Delete</button>
        </td>
    </tr>`;

    document.getElementById('amount').value = '';
    document.getElementById('discription').value = '';
    document.getElementById('catagory').value = '';
}

async function editAppointment (id, event) {
    const catagory = event.parentElement.previousElementSibling.textContent;
    const discription = event.parentElement.previousElementSibling.previousElementSibling.textContent;
    const amount = event.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
    
    
    // populate these values in the input fields
    document.getElementById('amount').value = amount;
    document.getElementById('discription').value = discription;
    document.getElementById('catagory').value = catagory;

    document.getElementById('add').style.display = 'none';
    document.getElementById('update').style.display = 'inline-block';

    const editBtn = document.getElementById('update');

    editBtn.addEventListener('click', async() => {
        if(validate()){
            const inputAmount = document.getElementById('amount').value;
            const inputDiscription = document.getElementById('discription').value;
            const inputCatagory = document.getElementById('catagory').value;
    
            const obj = {
                amount : inputAmount,
                discription : inputDiscription,
                catagory : inputCatagory
            }
            try {
                // update in the dom through event object
                event.parentElement.previousElementSibling.textContent = inputCatagory;
                event.parentElement.previousElementSibling.previousElementSibling.textContent = inputDiscription;
                event.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent = inputAmount;
        
                // update in database
                const updt = await axiosInstance.put(`/expenses/${id}`, obj);

            } catch (err) {
                console.log(err);
                alert(err.message);
            }
        }

    })
}

async function deleteAppointment (id, event) {
    try {
        const tbody = document.querySelector('tbody');
        const tr = event.parentElement.parentElement;
        tbody.removeChild(tr);
        const del = await axiosInstance.delete(`/expenses/${id}`);
    } catch (err) {
        console.log(err);
        alert(err.message);
    }
}