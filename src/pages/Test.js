import React, {useRef} from 'react'

function Test() {
  const refer = useRef();
  
  // const draggables = refer.current.querySelectorAll('.draggable');
  // const containers = refer.current.querySelectorAll('.container');
  
  // const handleTest = ()=>{
  //   // console.log('containers:'+containers)
  //   // console.log('draggles:'+draggables)
  // };

  // const func_dragstart = e=>{
  //   e.currentTarget.classList.add('dragging');
  // };

  // const func_dragend = e=>{
  //   e.currentTarget.classList.remove('dragging');
  // };

  // const func_dragover = e =>{
  //   e.preventDefault();
  
  //   const afterElement = getDragAfterElement(e.clientY);
  //   console.log(afterElement)

  //   const elem_drag = refer.current.querySelector('.dragging')
  //   if(afterElement===undefined){
  //     try{e.currentTarget.appendChild(elem_drag)}catch{}
  //   }else{
  //     try{e.currentTarget.insertBefore(elem_drag, afterElement)}catch{}
  //   }
      
  // };

  // const getDragAfterElement = (y)=>{
  //   let elems_draggable= [...refer.current.querySelectorAll('.draggable:not(.dragging)')];
    
  //   let elem_above = elems_draggable.reduce((accum,item,i)=>{
  //     const box = item.getBoundingClientRect();
  //     const offset = y - (box.top + box.height/2);
  //     // console.log('box:'+i+'    '+offset);

  //     if(offset < 0 && offset > accum){
  //       return item
  //     }else{
  //       return accum
  //     };
      
  //   },{offset:Number.NEGATIVE_INFINITY_INFINITY})

  //   return elem_above
  // };

  // const getDragAfterElement = (y)=>{
  //   let elems_draggable= [...refer.current.querySelectorAll('.draggable:not(.dragging)')];
    
  //   let elemsBelow = elems_draggable.filter(item=>{
  //     const box = item.getBoundingClientRect();
  //     const offset = y - (box.top + box.height/2);
  //     return (offset < 0 && item!==undefined)
  //   })

  //   let smallest = elemsBelow.reduce((accum, item)=>{
  //     const box = item.getBoundingClientRect();
  //     const offset = Math.abs(y - (box.top + box.height/2));
  //     accum = (offset < accum.num)?{num:offset,element:item}:accum;
  //     return accum
  //   },{num:Number.POSITIVE_INFINITY})

  //   return smallest.element

  // };










  function handleDragOver(e){
    e.preventDefault(e);

    const dragging = refer.current.querySelector('.dragging');
    const dragItems = [...refer.current.querySelectorAll('.dragItem')];
    const filterItems = dragItems.filter(item=>item!==dragging);
    // const filterItems2 = [...refer.current.querySelectorAll('.dragItem:not(.dragging)')];
    // console.log(dragging)
    // console.log(dragItems)
    // console.log(filterItems)
    // console.log(filterItems2)

    let positionDrag = e.clientY;
    console.log('Dragging:'+positionDrag);

    let elemBelowDragging = function(){
      let filter1 = filterItems.filter(item=>item.getBoundingClientRect())
    };
    
  };

  function handleDragStart(e){
    // e.preventDefault(e);
    e.currentTarget.classList.add('dragging');
    
  };

  function handleDragEnd(e){
    // e.preventDefault(e);
    e.currentTarget.classList.remove('dragging');
    
  };

  return (
    

    <div ref={refer}>

      <div onDragOver={function(e){handleDragOver(e)}}
        style={{backgroundColor:'gray', margin:'10px', padding:'10px'}}>
        container 1

          <div className="dragItem" draggable='true' onDragStart={function(e){handleDragStart(e)}} onDragEnd={function(e){handleDragEnd(e)}}
            style={{backgroundColor:'white', margin:'10px'}}>Box 1</div>
          
          <div className="dragItem" draggable='true' onDragStart={function(e){handleDragStart(e)}} onDragEnd={function(e){handleDragEnd(e)}}
            style={{backgroundColor:'white', margin:'10px'}}>Box 2</div>
      
      </div>
      
      <div onDragOver={function(e){handleDragOver(e)}}
        style={{backgroundColor:'gray', margin:'10px', padding:'10px'}}>
        container 2

        <div className="dragItem" draggable='true' onDragStart={function(e){handleDragStart(e)}} onDragEnd={function(e){handleDragEnd(e)}}
          style={{backgroundColor:'white', margin:'10px'}}>Box 3</div>
        
        <div className="dragItem" draggable='true' onDragStart={function(e){handleDragStart(e)}} onDragEnd={function(e){handleDragEnd(e)}}
          style={{backgroundColor:'white', margin:'10px'}}>Box 4</div>
      
      </div>


    </div>
























    // <div ref={refer}>

    //   <style>
    //     {`
          
    //       .dragging{
    //         opacity:0.5;
    //         color:red;
    //       }
        
    //     `}
    //   </style>

    //   <div className='container' onDragOver={e=>func_dragover(e)} 
    //     style={{backgroundColor:'#333', padding:'30px', margin:'10px'}}>
      
    //     <p className='draggable' draggable='true' onDragStart={e=>func_dragstart(e)} onDragEnd={e=>func_dragend(e)}
    //       style={{backgroundColor:'#ffffff', padding:'10px', margin:'10px'}}>1</p>

    //     <p className='draggable' draggable='true' onDragStart={e=>func_dragstart(e)} onDragEnd={e=>func_dragend(e)}
    //       style={{backgroundColor:'#ffffff', padding:'10px', margin:'10px'}}>2</p>
      
    //   </div>
       
    //   <div className='container' onDragOver={e=>func_dragover(e)} 
    //     style={{backgroundColor:'#333', padding:'30px', margin:'10px'}}>

    //     <p className='draggable' draggable='true' onDragStart={e=>func_dragstart(e)} onDragEnd={e=>func_dragend(e)}
    //       style={{backgroundColor:'#ffffff', padding:'10px', margin:'10px'}}>3</p>
        
    //     <p className='draggable' draggable='true' onDragStart={e=>func_dragstart(e)} onDragEnd={e=>func_dragend(e)}
    //       style={{backgroundColor:'#ffffff', padding:'10px', margin:'10px'}}>4</p>
      
    //   </div>

    //   <input type='button' value='test' onClick={()=>test()} style={{height:'40px', width:'40px'}}/>

     

    // </div>
  )
}

export default Test