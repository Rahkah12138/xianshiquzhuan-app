<template>
	<view>
		<div class="loader-wrapper">
		    <div class="loader"></div>
		</div>
	</view>
</template>

<script>
	export default {
		name:"loading",
		data() {
			return {
				
			};
		}
	}
</script>

<style>

	    .loader-wrapper {
	      width: 100%;
	      display: flex;
	      align-items: center;
		  padding: 10rpx 0;
	      justify-content: center;
	      background-color: #fff; /* Change this to match your page background color */
	      z-index: 1000; /* Ensure it's on top of other elements */
	    }
	    
	    .loader {
	      border: 4px solid #f3f3f3;
	      border-top: 4px solid #3498db;
	      border-radius: 50%;
	      width: 40rpx;
	      height: 40rpx;
	      animation: spin 1s linear infinite;
	    }
	    
	    @keyframes spin {
	      0% { transform: rotate(0deg); }
	      100% { transform: rotate(360deg); }
	    }
</style>