---
layout: post
permalink: Topics-Templates
---
选择排序/Cycle Sort让

Quick Sort

```java
public classQuickSort {
	public int[] quickSort(int[] array) {
		if (array == null || array.length <= 1) {
			return array;
		}
		//overloading here
		quickSort(array, 0, array.length - 1);
		return array;
	}

	private void quickSort(int[] array, int left, int right) {
		//recursion base case
		if (left >= right) {
			return;
		}
		//find pivot position and do partition
		int pivotIndex = findPosAndPartition(array, left, right);
		quickSort(array, left, pivotIndex - 1);
		quickSort(array, pivotIndex + 1, right);
	}
	
	private int findPosAndPartition(int[] array, int left, int right) {
		//random.nextInt(k) → [0, k) / random()[0, 1) → [0, 4)
		Random rn = new Random();
		int pivot = left + rn.nextInt(right - left + 1); //better
		int pivotValue = array[pivot];
		swap(array, pivot, right); //把pivot放在最后
	
		int leftI = left;
		int rightI = right - 1; //array[right] is now the pivot
		
		while (left <= right) {
			if (array[leftI] < pivotValue) {
				leftI++;
			} else if (array[rightI] >= pivotValue) {
				rightI--;
			} else {
				swap(array, leftI++, rightI--);
			}
		}
		//因为之前将pivot放在了right的位置，这后要换回来，放到它应该放的位置
		swap(array, leftI, right); //对调的是值，而不是index
		return leftI;
		}
}

/**
Time Complexity : O(nlogn) → 最坏的情况下是 n^2
Space Complexity : O(1) → 原地交换
*/
```

Merge Sort

```java
public class MergeSort {
	public int[] mergeSort(int[] array) {
		//corner case
		if (array == null || array.length <= 1) {
			return array;
		}
		int[] helper = new int[array.length];
		mergeSort(array, helper, 0, array.length - 1);
		return array;
	}

	private void mergeSort(int[] array, int[] helper, int left, int right) {
		//base case
		if (left == right) return;
		int mid = left + (right - left) / 2;
		//divide
		mergeSort(array, helper, left, mid);
		mergeSort(array, helper, mid + 1, right);
		//merge
		merge(array, helper, left, mid, right);
	}
	
	private void merge(int[] array, int[] helper, int left, int mid, int right) {
		for (int i = left, i <= right, i++) {
			helper[i] = array[i];
		}
		int leftIndex = left; 
		int rightIndex = mid + 1;
		int cur = left; 
		while (leftIndex <= mid && rightIndex <= right) {
			if (helper[leftIndex] < helper[rightIndex]) {
				array[cur++] = helper[leftIndex++];
			} else {
				array[cur++] = helper[rightIndex++];
			}
		}
		while (leftIndex <= mid) {
			array[cur++] = helper[leftIndex++];
		}
		while (rightIndex <= right) {
			array[cur++] = helper[rightIndex++];
		}
	}

/**
Time Complexity : O(nlogn) 
Space Complexity : O(n)  需要额外的数组 
	- 栈空间 O(logN)
	- 堆空间 O(nlogn) - O(n)
*/
```

BFS

```java
// 节点访问标识,访问过的节点无需访问（剪枝）
int[][] visited = new int[m][n];
// 队列初始化
Queue<Node> queue = new LinkedList();

// 【第1步】将起点加入队列, 非空进入循环
queue.add(第一个数据)
// 如果这里有visited的数组来记录，那元素入队列的时候就得改变状态
while(!queue.isEmpty()) {
    // 【第2步】 获取当前队列长度即同一层级（辈分）节点个数，并遍历
    int size = queue.size(); // 一定要先获取，queue后面要加入下一层级节点
    for (int i = 0; i < size; i++) {
        // 【第3步】 对同一层级节点逐个寻找下一层有效**路径节点**，找到目标直接返回结果终止搜索。
        Node node = queue.poll();
        // 下一层节点 比如网格上下左右移动
        Node nextNode = node.x + xj;
        //  1. 不符合要求的下一层节点直接过滤（比如越界、已经被visited[][]标记访问了）
        //  2. 找到目标节点 直接返回结果
        //  3. 符合要求的下一层节点放入队列
        //  同样，如果这里有visited的数组来记录，那元素入队列的时候就得改变状态
        queue.offer(nextNode)
    }
}
// 【第4步】 BFS搜索完成没找到结果，返回-1
return -1;

```