<?php
/**
 * The Drip JS snippet
 *
 * @package Drip_Woocommerce
 */

?>

<!-- Drip Code -->
<script type="text/javascript">
	var _dcq = _dcq || [];
	var _dcs = _dcs || {};
	_dcs.account = '<?php echo esc_js( $account_id ); ?>';

	(function() {
		var dc = document.createElement('script');
		dc.type = 'text/javascript'; dc.async = true;
		dc.src = '//tag.getdrip.com/<?php echo esc_js( $account_id ); ?>.js';
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(dc, s);
	})();
</script>
